const express = require('express');
const { 
  getUserDashboard,
  getUserProfile, 
  updateUserProfile 
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes in this router
router.use(protect);

router.get('/dashboard', getUserDashboard);
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);

module.exports = router;