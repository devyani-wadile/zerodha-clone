
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // First check the Authorization header.
  const authHeader = req.headers.authorization;

  const bearerToken =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  // Keep cookie support for compatibility.
  const token = bearerToken || req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      message: "Access denied. Please login first.",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = authMiddleware;
