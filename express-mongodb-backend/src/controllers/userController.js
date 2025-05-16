const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get user dashboard data
// @route   GET /api/users/dashboard
// @access  Private
exports.getUserDashboard = asyncHandler(async (req, res, next) => {
  // In a real app, you would fetch pet info, appointments, prescriptions, etc.
  // For this example, we'll just return some mock data
  
  const dashboardData = {
    pets: [
      { id: '1', name: 'Max', type: 'Dog', breed: 'Labrador', age: 3 },
      { id: '2', name: 'Luna', type: 'Cat', breed: 'Persian', age: 2 }
    ],
    upcomingAppointments: [
      { id: '1', petName: 'Max', date: '2023-05-25', time: '10:00 AM', vet: 'Dr. Sarah Smith', reason: 'Annual check-up' },
      { id: '2', petName: 'Luna', date: '2023-06-02', time: '2:30 PM', vet: 'Dr. Mark Johnson', reason: 'Vaccination' }
    ],
    activePrescriptions: [
      { id: '1', petName: 'Max', medication: 'Antibiotic', dosage: '1 tablet twice daily', refillsLeft: 2, expiryDate: '2023-07-15' },
      { id: '2', petName: 'Luna', medication: 'Allergy medication', dosage: '1/2 tablet daily', refillsLeft: 1, expiryDate: '2023-06-20' }
    ],
    notifications: [
      { id: '1', message: 'Max\'s appointment confirmed for May 25', time: '1 day ago' },
      { id: '2', message: 'Luna\'s prescription ready for pickup', time: '2 days ago' },
      { id: '3', message: 'Reminder: Max\'s vaccinations due next month', time: '3 days ago' }
    ]
  };

  res.status(200).json({
    success: true,
    data: dashboardData
  });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id ${req.user.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});