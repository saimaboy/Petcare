const express = require('express');
const {
  getPharmacyDashboard,
  getPharmacyProfile,
  updatePharmacyProfile
} = require('../controllers/pharmacyController');

const router = express.Router();

// Import middleware
const { protect, authorize } = require('../middleware/auth');

// Apply protection and authorization to all routes
router.use(protect);
router.use(authorize('pharmacist'));

// Routes
router.get('/dashboard', getPharmacyDashboard);
router.get('/profile', getPharmacyProfile);
router.put('/profile', updatePharmacyProfile);

module.exports = router;