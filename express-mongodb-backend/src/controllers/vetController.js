const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get vet dashboard data
// @route   GET /api/vet/dashboard
// @access  Private (Veterinarians only)
exports.getVetDashboard = asyncHandler(async (req, res, next) => {
  // In a real app, you would fetch appointments, patient records, etc.
  // For this example, we'll just return some mock data
  
  const dashboardData = {
    appointmentsToday: 5,
    pendingAppointments: 12,
    recentPatients: [
      { id: '1', name: 'Max', owner: 'John Doe', lastVisit: '2023-05-10', status: 'Healthy' },
      { id: '2', name: 'Bella', owner: 'Jane Smith', lastVisit: '2023-05-12', status: 'Under treatment' },
      { id: '3', name: 'Charlie', owner: 'Mike Johnson', lastVisit: '2023-05-15', status: 'Follow-up required' }
    ],
    notifications: [
      { id: '1', message: 'New appointment request from Sarah Connor', time: '2 hours ago' },
      { id: '2', message: 'Lab results ready for patient Rex', time: '3 hours ago' },
      { id: '3', message: 'Prescription renewal request from Alex Martinez', time: '1 day ago' }
    ]
  };

  res.status(200).json({
    success: true,
    data: dashboardData
  });
});

// @desc    Get vet profile
// @route   GET /api/vet/profile
// @access  Private (Veterinarians only)
exports.getVetProfile = asyncHandler(async (req, res, next) => {
  const vet = await User.findById(req.user.id);

  if (!vet) {
    return next(new ErrorResponse(`Veterinarian not found with id ${req.user.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: vet
  });
});

// @desc    Update vet profile
// @route   PUT /api/vet/profile
// @access  Private (Veterinarians only)
exports.updateVetProfile = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    businessName: req.body.businessName,
    licenseNumber: req.body.licenseNumber
  };

  const vet = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: vet
  });
});