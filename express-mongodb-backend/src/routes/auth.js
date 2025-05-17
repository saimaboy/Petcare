const express = require('express');
const jwt = require('jsonwebtoken'); 
const { 
  register,
  login,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
  updatePassword,
  verifyToken
} = require('../controllers/authController');

const router = express.Router();

// Simple auth middleware
const simpleAuth = (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    
    // If no token, reject access
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }
    
    // Verify token 
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'defaultsecret'
    );
    
    // Set user ID for route handlers
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }
};

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.get('/verify', verifyToken);

// Protected routes
router.get('/me', simpleAuth, getMe);
router.put('/updateprofile', simpleAuth, updateProfile);
router.put('/updatepassword', simpleAuth, updatePassword);

module.exports = router;