
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Read JWT from HTTP-only cookie
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      message: "Access denied. Please login first.",
    });
  }

  try {
    // Verify JWT using secret key
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Attach authenticated user information
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(403).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = authMiddleware;
