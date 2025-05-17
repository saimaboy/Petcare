const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Get all veterinarians
// @route   GET /api/veterinarians
// @access  Public
exports.getVeterinarians = asyncHandler(async (req, res) => {
  const veterinarians = await User.find({ 
    role: 'veterinarian',
    serviceType: 'veterinarian'
  }).select('name email phoneNumber businessName licenseNumber _id');

  res.status(200).json({
    success: true,
    count: veterinarians.length,
    data: veterinarians
  });
});

// @desc    Get single veterinarian
// @route   GET /api/veterinarians/:id
// @access  Public
exports.getVeterinarian = asyncHandler(async (req, res) => {
  const veterinarian = await User.findOne({ 
    _id: req.params.id,
    role: 'veterinarian',
    serviceType: 'veterinarian'
  }).select('name email phoneNumber businessName licenseNumber _id');

  if (!veterinarian) {
    return res.status(404).json({
      success: false,
      message: 'Veterinarian not found'
    });
  }

  res.status(200).json({
    success: true,
    data: veterinarian
  });
});