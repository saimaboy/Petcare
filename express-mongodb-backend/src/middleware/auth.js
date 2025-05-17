const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const User = require('../models/User');

// Protect routes - verify token
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  
  // Add debug logs to trace authentication flow
  console.log('Authentication headers:', req.headers.authorization);

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Get token from header (remove "Bearer " prefix)
    token = req.headers.authorization.split(' ')[1];
    console.log('Token extracted from Authorization header');
  }

  // Make sure token exists
  if (!token) {
    console.log('No token found in request');
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded successfully:', decoded);

    // Find user by ID from token
    const user = await User.findById(decoded.id);

    if (!user) {
      console.log('User not found for token');
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }

    // Set req.user to the authenticated user
    req.user = user;
    console.log('User attached to request:', user._id);
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    
    next();
  };
};