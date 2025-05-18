const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const User = require("../models/User");

// Protect routes - verify token
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Log request headers for debugging
  console.log("Authentication headers:", req.headers.authorization);

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    console.log("Token extracted from Authorization header");
  }

  // Check if token exists
  if (!token) {
    console.log("No token found in request");
    return res.status(401).json({
      success: false,
      error: "Not authorized: No token provided",
    });
  }

  try {
    // Verify JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables");
      return res.status(500).json({
        success: false,
        error: "Server configuration error",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded successfully:", decoded);

    // Ensure decoded token has id
    if (!decoded.id) {
      console.log("Token payload missing id field");
      return res.status(401).json({
        success: false,
        error: "Invalid token: Missing user ID",
      });
    }

    // Find user by ID
    const user = await User.findById(decoded.id).select("-password"); // Exclude password for security
    if (!user) {
      console.log("User not found for ID:", decoded.id);
      return res.status(401).json({
        success: false,
        error: "User not found",
      });
    }

    // Attach user to request
    req.user = user;
    req.userId = user._id.toString(); // Add req.userId for compatibility with orders routes
    console.log("User attached to request:", user._id);
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message, err.stack);
    return res.status(401).json({
      success: false,
      error: `Not authorized: ${err.message || "Invalid token"}`,
    });
  }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }

    next();
  };
};