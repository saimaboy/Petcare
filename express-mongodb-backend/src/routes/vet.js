const express = require('express');
const {
  getVetDashboard,
  getVetProfile,
  updateVetProfile
} = require('../controllers/veterinarianController');

const router = express.Router();

// Import middleware
const { protect, authorize } = require('../middleware/auth');

// Apply protection and authorization to all routes
router.use(protect);
router.use(authorize('veterinarian'));

// Routes
router.get('/dashboard', getVetDashboard);
router.get('/profile', getVetProfile);
router.put('/profile', updateVetProfile);

module.exports = router;