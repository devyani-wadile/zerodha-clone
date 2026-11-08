require("dotenv").config();

const mongoose = require("mongoose");
const { PositionsModel } = require("./model/PositionsModel");
const { UserModel } = require("./model/UserModel");

const assignPositions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    const user = await UserModel.findOne({
      username: "NamrataTest",
    });

    if (!user) {
      throw new Error("NamrataTest account not found");
    }

    const result = await PositionsModel.updateMany(
      { userId: { $exists: false } },
      { $set: { userId: user._id } }
    );

    console.log("User:", user.username);
    console.log("Positions assigned:", result.modifiedCount);
  } catch (error) {
    console.error("Migration failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

assignPositions();