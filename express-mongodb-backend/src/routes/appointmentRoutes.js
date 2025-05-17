const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const asyncHandler = require('../middleware/async');
const Appointment = require('../models/Appointment');

// GET all appointments (admin only)
router.get('/', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const appointments = await Appointment.find();
  res.status(200).json({
    success: true,
    count: appointments.length,
    data: appointments
  });
}));

// POST new appointment (public route for booking)
router.post('/', asyncHandler(async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);
    res.status(201).json({
      success: true,
      data: appointment
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
}));

// GET vet appointments (for vet dashboard)
router.get('/vet', protect, authorize('veterinarian'), asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ vetId: req.user.id });
  res.status(200).json({
    success: true,
    count: appointments.length,
    data: appointments
  });
}));

// Update appointment status (for vet to mark completed/cancelled)
router.put('/:id', protect, authorize('veterinarian'), asyncHandler(async (req, res) => {
  let appointment = await Appointment.findById(req.params.id);
  
  if (!appointment) {
    return res.status(404).json({
      success: false,
      error: 'Appointment not found'
    });
  }

  // Make sure appointment belongs to this vet
  if (appointment.vetId.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to update this appointment'
    });
  }

  appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: appointment
  });
}));

module.exports = router;