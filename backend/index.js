
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Models
const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");
const { UserModel } = require("./model/UserModel");
const { FundsModel } = require("./model/FundsModel");
const { FundsTransactionModel } = require("./model/FundsTransactionModel");

// Middleware
const authMiddleware = require("./middleware/authMiddleware");

// Configuration
const PORT = process.env.PORT || 3002;
const MONGO_URL = process.env.MONGO_URL;
const JWT_SECRET = process.env.JWT_SECRET;

const app = express();

const isProduction = process.env.NODE_ENV === "production";

// Trust Render's reverse proxy
app.set("trust proxy", 1);

// Cookie configuration
const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 60 * 60 * 1000,
  path: "/",
};

// ==================== MIDDLEWARE ====================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL,
  process.env.DASHBOARD_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(bodyParser.json());


// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Zerodha Clone API is running",
  });
});

// ==================== HOLDINGS ====================

app.get("/allHoldings", authMiddleware, async (req, res) => {
  try {
    const allHoldings = await HoldingsModel.find({
      userId: req.user.id,
    });

    res.status(200).json(allHoldings);
  } catch (error) {
    console.error("Error fetching holdings:", error);

    res.status(500).json({
      message: "Unable to fetch holdings",
    });
  }
});

// ==================== POSITIONS ====================

app.get("/allPositions", authMiddleware, async (req, res) => {
  try {
    const allPositions = await PositionsModel.find({
      userId: req.user.id,
    });

    res.status(200).json(allPositions);
  } catch (error) {
    console.error("Error fetching positions:", error);

    res.status(500).json({
      message: "Failed to fetch positions",
    });
  }
});

// ==================== ORDERS ====================

app.get("/allOrders", authMiddleware, async (req, res) => {
  try {
    const allOrders = await OrdersModel.find({
      userId: req.user.id,
    });

    res.status(200).json(allOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);

    res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
});

// ==================== CREATE BUY / SELL ORDER ====================

app.post("/newOrder", authMiddleware, async (req, res) => {
  let session;

  try {
    const { name, qty, price, mode } = req.body;

    const stockName =
      typeof name === "string" ? name.trim() : "";

    const quantity = Number(qty);
    const stockPrice = Number(price);

    const orderMode =
      typeof mode === "string" ? mode.toUpperCase() : "";

    if (
      !stockName ||
      !Number.isInteger(quantity) ||
      quantity <= 0 ||
      !Number.isFinite(stockPrice) ||
      stockPrice <= 0 ||
      !["BUY", "SELL"].includes(orderMode)
    ) {
      return res.status(400).json({
        message: "Invalid order details",
      });
    }

    const totalAmount = Number(
      (quantity * stockPrice).toFixed(2)
    );

    if (!Number.isFinite(totalAmount)) {
      return res.status(400).json({
        message: "Invalid order amount",
      });
    }

    session = await mongoose.startSession();

    await session.withTransaction(async () => {
      const funds = await FundsModel.findOne({
        userId: req.user.id,
      }).session(session);

      if (!funds) {
        const error = new Error(
          "Funds account not initialized. Please visit the Funds page."
        );
        error.statusCode = 400;
        throw error;
      }

      const existingHolding = await HoldingsModel.findOne({
        name: stockName,
        userId: req.user.id,
      }).session(session);

      // BUY
      if (orderMode === "BUY") {
        if (funds.availableBalance < totalAmount) {
          const error = new Error(
            `Insufficient funds. Available balance: ₹${funds.availableBalance.toFixed(2)}`
          );
          error.statusCode = 400;
          throw error;
        }

        funds.availableBalance = Number(
          (funds.availableBalance - totalAmount).toFixed(2)
        );

        await funds.save({ session });

        if (existingHolding) {
          const oldQuantity = existingHolding.qty;
          const newQuantity = oldQuantity + quantity;

          const newAverage =
            (
              existingHolding.avg * oldQuantity +
              stockPrice * quantity
            ) / newQuantity;

          existingHolding.qty = newQuantity;
          existingHolding.avg = Number(newAverage.toFixed(2));
          existingHolding.price = stockPrice;

          await existingHolding.save({ session });
        } else {
          const newHolding = new HoldingsModel({
            name: stockName,
            qty: quantity,
            avg: stockPrice,
            price: stockPrice,
            net: "0.00%",
            day: "0.00%",
            userId: req.user.id,
          });

          await newHolding.save({ session });
        }
      }

      // SELL
      if (orderMode === "SELL") {
        if (!existingHolding) {
          const error = new Error("You do not own this stock.");
          error.statusCode = 400;
          throw error;
        }

        if (existingHolding.qty < quantity) {
          const error = new Error(
            `Insufficient quantity. You currently own ${existingHolding.qty} shares.`
          );
          error.statusCode = 400;
          throw error;
        }

        const remainingQuantity =
          existingHolding.qty - quantity;

        if (remainingQuantity === 0) {
          await HoldingsModel.deleteOne({
            _id: existingHolding._id,
            userId: req.user.id,
          }).session(session);
        } else {
          existingHolding.qty = remainingQuantity;
          existingHolding.price = stockPrice;

          await existingHolding.save({ session });
        }

        funds.availableBalance = Number(
          (funds.availableBalance + totalAmount).toFixed(2)
        );

        await funds.save({ session });
      }

      // SAVE ORDER
      const newOrder = new OrdersModel({
        name: stockName,
        qty: quantity,
        price: stockPrice,
        mode: orderMode,
        userId: req.user.id,
      });

      await newOrder.save({ session });
    });

    res.status(201).json({
      message:
        orderMode === "BUY"
          ? `BUY successful! ₹${totalAmount.toFixed(2)} deducted from your funds.`
          : `SELL successful! ₹${totalAmount.toFixed(2)} credited to your funds.`,
    });
  } catch (error) {
    console.error("Error processing order:", error);

    res.status(error.statusCode || 500).json({
      message: error.statusCode
        ? error.message
        : "Unable to process order",
    });
  } finally {
    if (session) {
      await session.endSession();
    }
  }
});

// ==================== FUNDS ====================

app.get("/allFunds", authMiddleware, async (req, res) => {
  try {
    let funds = await FundsModel.findOne({
      userId: req.user.id,
    });

    if (!funds) {
      funds = await FundsModel.create({
        userId: req.user.id,
        availableBalance: 100000,
        usedMargin: 0,
      });
    }

    res.status(200).json(funds);
  } catch (error) {
    console.error("Error fetching funds:", error);

    res.status(500).json({
      message: "Unable to fetch funds",
    });
  }
});

// ==================== ADD FUNDS ====================

app.post("/addFunds", authMiddleware, async (req, res) => {
  let session;

  try {
    const amount = Number(req.body.amount);

    if (!Number.isFinite(amount) || amount <= 0 || amount > 10000000) {
      return res.status(400).json({
        message: "Enter a valid amount between ₹0.01 and ₹1,00,00,000",
      });
    }

    const roundedAmount = Number(amount.toFixed(2));

    session = await mongoose.startSession();

    await session.withTransaction(async () => {
      const funds = await FundsModel.findOne({
        userId: req.user.id,
      }).session(session);

      if (!funds) {
        const error = new Error("Funds account not found");
        error.statusCode = 404;
        throw error;
      }

      funds.availableBalance = Number(
        (funds.availableBalance + roundedAmount).toFixed(2)
      );

      await funds.save({ session });

      const transaction = new FundsTransactionModel({
        userId: req.user.id,
        type: "ADD",
        amount: roundedAmount,
      });

      await transaction.save({ session });
    });

    res.status(200).json({
      message: `₹${roundedAmount.toFixed(2)} added successfully`,
    });
  } catch (error) {
    console.error("Add funds error:", error);

    res.status(error.statusCode || 500).json({
      message: error.statusCode
        ? error.message
        : "Unable to add funds",
    });
  } finally {
    if (session) {
      await session.endSession();
    }
  }
});

// ==================== WITHDRAW FUNDS ====================

app.post("/withdrawFunds", authMiddleware, async (req, res) => {
  let session;

  try {
    const amount = Number(req.body.amount);

    if (!Number.isFinite(amount) || amount <= 0 || amount > 10000000) {
      return res.status(400).json({
        message: "Enter a valid withdrawal amount",
      });
    }

    const roundedAmount = Number(amount.toFixed(2));

    session = await mongoose.startSession();

    await session.withTransaction(async () => {
      const funds = await FundsModel.findOne({
        userId: req.user.id,
      }).session(session);

      if (!funds) {
        const error = new Error("Funds account not found");
        error.statusCode = 404;
        throw error;
      }

      if (funds.availableBalance < roundedAmount) {
        const error = new Error(
          `Insufficient balance. Available balance: ₹${funds.availableBalance.toFixed(2)}`
        );
        error.statusCode = 400;
        throw error;
      }

      funds.availableBalance = Number(
        (funds.availableBalance - roundedAmount).toFixed(2)
      );

      await funds.save({ session });

      const transaction = new FundsTransactionModel({
        userId: req.user.id,
        type: "WITHDRAW",
        amount: roundedAmount,
      });

      await transaction.save({ session });
    });

    res.status(200).json({
      message: `₹${roundedAmount.toFixed(2)} withdrawn successfully`,
    });
  } catch (error) {
    console.error("Withdraw funds error:", error);

    res.status(error.statusCode || 500).json({
      message: error.statusCode
        ? error.message
        : "Unable to withdraw funds",
    });
  } finally {
    if (session) {
      await session.endSession();
    }
  }
});

// ==================== FUND TRANSACTION HISTORY ====================

app.get("/allFundsTransactions", authMiddleware, async (req, res) => {
  try {
    const transactions = await FundsTransactionModel.find({
      userId: req.user.id,
    })
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching fund transactions:", error);

    return res.status(500).json({
      message: "Unable to fetch transaction history.",
    });
  }
});

// ==================== SIGNUP ====================

app.post("/signup", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (
      typeof email !== "string" ||
      typeof username !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message: "Invalid input",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim();

    if (!normalizedUsername) {
      return res.status(400).json({
        message: "Username is required",
      });
    }

    const existingUser = await UserModel.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const newUser = new UserModel({
      email: normalizedEmail,
      username: normalizedUsername,
      password,
    });

    await newUser.save();

    await FundsModel.create({
      userId: newUser._id,
      availableBalance: 100000,
      usedMargin: 0,
    });

    res.status(201).json({
      message: "Registration successful",
    });
  } catch (error) {
    console.error("Signup error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    res.status(500).json({
      message: "Server error during registration",
    });
  }
});

// ==================== LOGIN ====================

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await UserModel.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      message: "Login successful",
      username: user.username,
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error during login",
    });
  }
});

// ==================== LOGOUT ====================

app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: cookieOptions.httpOnly,
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite,
    path: cookieOptions.path,
  });

  res.status(200).json({
    message: "Logged out successfully",
  });
});

// ==================== VERIFY TOKEN ====================

app.get("/verify-token", authMiddleware, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id)
      .select("username");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Token is valid. Authentication successful!",
      userId: user._id,
      username: user.username,
    });
  } catch (error) {
    console.error("Token verification error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// ==================== DATABASE CONNECTION ====================

if (!MONGO_URL) {
  console.error("MONGO_URL is missing");
  process.exit(1);
}

if (!JWT_SECRET) {
  console.error("JWT_SECRET is missing");
  process.exit(1);
}

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("DB connected successfully!");

    app.listen(PORT, () => {
      console.log(`Zerodha Clone API started on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });
