const express = require('express');
const { 
  getUsers, 
  getUser, 
  createUser, 
  updateUser, 
  deleteUser 
} = require('../controllers/userController');

const router = express.Router();
const jwt = require('jsonwebtoken');

// Simple auth middleware
const simpleAuth = (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    
    // If no token, allow access but mark as unauthenticated
    if (!token) {
      req.isAuthenticated = false;
      req.user = null;
      return next();
    }
    
    // Verify token with minimal checks
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'defaultsecret'
    );
    
    // Add user info to request
    req.isAuthenticated = true;
    req.userId = decoded.id;
    req.userRole = decoded.role || 'user';
    
    next();
  } catch (error) {
    // If token is invalid, allow access but mark as unauthenticated
    req.isAuthenticated = false;
    req.user = null;
    next();
  }
};

// Apply simple auth to all routes
router.use(simpleAuth);

// Get all users
router.get('/', (req, res) => {
  // Check if admin in the controller instead of middleware
  if (req.userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  
  getUsers(req, res);
});

// Create user (admin only)
router.post('/', (req, res) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  
  createUser(req, res);
});

// Get individual user
router.get('/:id', (req, res) => {
  // Allow if user is requesting own data or is admin
  if (!req.isAuthenticated || (req.userId !== req.params.id && req.userRole !== 'admin')) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }
  
  getUser(req, res);
});

// Update user
router.put('/:id', (req, res) => {
  // Allow if user is updating own data or is admin
  if (!req.isAuthenticated || (req.userId !== req.params.id && req.userRole !== 'admin')) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }
  
  updateUser(req, res);
});

// Delete user (admin only)
router.delete('/:id', (req, res) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  
  deleteUser(req, res);
});

module.exports = router;