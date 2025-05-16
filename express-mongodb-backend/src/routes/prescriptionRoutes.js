const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// Temporary implementation until you create a proper controller and model
router.get('/', protect, asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: "Prescription routes are set up properly",
      prescriptions: []
    }
  });
}));

module.exports = router;