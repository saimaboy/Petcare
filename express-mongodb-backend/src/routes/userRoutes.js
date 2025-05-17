const express = require('express');
const { 
  getUsers, 
  getUser, 
  createUser, 
  updateUser, 
  deleteUser 
} = require('../controllers/userController');
const User = require('../models/User'); // Add this
const router = express.Router();
const jwt = require('jsonwebtoken');

// Import middleware
const { protect, authorize } = require('../middleware/auth'); // Add this
const multer = require('multer'); // Add this
const path = require('path'); // Add this
const fs = require('fs'); // Add this

// Configure multer for file uploads
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, 'profile-' + uniqueSuffix + extension);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Simple auth middleware
const simpleAuth = (req, res, next) => {
  // ... existing code ...
};

// Apply simple auth to all routes
router.use(simpleAuth);

// Get all users
router.get('/', (req, res) => {
  // ... existing code ...
});

// Create user (admin only)
router.post('/', (req, res) => {
  // ... existing code ...
});

// Get individual user
router.get('/:id', (req, res) => {
  // ... existing code ...
});

// Update user
router.put('/:id', (req, res) => {
  // ... existing code ...
});

// Delete user (admin only)
router.delete('/:id', (req, res) => {
  // ... existing code ...
});

// Upload profile image - use simpleAuth instead of protect
router.post('/profile-image', simpleAuth, upload.single('profileImage'), async (req, res) => {
  try {
    // Check if authenticated
    if (!req.isAuthenticated) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No file uploaded' 
      });
    }
    
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }
    
    // Update user profile image
    user.profileImage = `/uploads/${req.file.filename}`;
    await user.save();
    
    return res.status(200).json({
      success: true,
      profileImage: user.profileImage
    });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Delete profile image - use simpleAuth instead of protect
router.delete('/profile-image', simpleAuth, async (req, res) => {
  try {
    // Check if authenticated
    if (!req.isAuthenticated) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }
    
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }
    
    // Remove profile image
    user.profileImage = null;
    await user.save();
    
    return res.status(200).json({
      success: true,
      message: 'Profile image removed successfully'
    });
  } catch (error) {
    console.error('Error removing profile image:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;