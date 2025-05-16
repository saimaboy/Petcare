const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get pharmacy dashboard data
// @route   GET /api/pharmacy/dashboard
// @access  Private (Pharmacists only)
exports.getPharmacyDashboard = asyncHandler(async (req, res, next) => {
  // In a real app, you would fetch prescriptions, inventory, etc.
  // For this example, we'll just return some mock data
  
  const dashboardData = {
    pendingPrescriptions: 8,
    completedPrescriptions: 15,
    lowStockItems: [
      { id: '1', name: 'Amoxicillin 250mg', currentStock: 10, reorderLevel: 15 },
      { id: '2', name: 'Flea Treatment', currentStock: 5, reorderLevel: 10 },
      { id: '3', name: 'Heartgard Plus', currentStock: 3, reorderLevel: 8 }
    ],
    recentOrders: [
      { id: '1', petName: 'Rex', ownerName: 'John Doe', medication: 'Antibiotic', status: 'Ready for pickup' },
      { id: '2', petName: 'Luna', ownerName: 'Sarah Connor', medication: 'Pain reliever', status: 'Processing' },
      { id: '3', petName: 'Boots', ownerName: 'Mike Johnson', medication: 'Allergy medication', status: 'Delivered' }
    ],
    notifications: [
      { id: '1', message: 'New prescription from Dr. Smith', time: '1 hour ago' },
      { id: '2', message: 'Order #1234 is ready for pickup', time: '3 hours ago' },
      { id: '3', message: 'Inventory alert: Heartgard Plus low stock', time: '1 day ago' }
    ]
  };

  res.status(200).json({
    success: true,
    data: dashboardData
  });
});

// @desc    Get pharmacy profile
// @route   GET /api/pharmacy/profile
// @access  Private (Pharmacists only)
exports.getPharmacyProfile = asyncHandler(async (req, res, next) => {
  const pharmacy = await User.findById(req.user.id);

  if (!pharmacy) {
    return next(new ErrorResponse(`Pharmacy not found with id ${req.user.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: pharmacy
  });
});

// @desc    Update pharmacy profile
// @route   PUT /api/pharmacy/profile
// @access  Private (Pharmacists only)
exports.updatePharmacyProfile = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    businessName: req.body.businessName,
    licenseNumber: req.body.licenseNumber
  };

  const pharmacy = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: pharmacy
  });
});