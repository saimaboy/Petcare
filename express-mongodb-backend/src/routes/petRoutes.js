const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const asyncHandler = require('../middleware/async');
const Pet = require('../models/Pet'); // Assume you'll create this model
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all pets for a user
// @route   GET /api/pets
// @access  Private
router.get('/', protect, asyncHandler(async (req, res, next) => {
  const pets = await Pet.find({ owner: req.user.id });
  
  res.status(200).json({
    success: true,
    count: pets.length,
    data: pets
  });
}));

// @desc    Get single pet
// @route   GET /api/pets/:id
// @access  Private
router.get('/:id', protect, asyncHandler(async (req, res, next) => {
  const pet = await Pet.findById(req.params.id);
  
  if (!pet) {
    return next(new ErrorResponse(`Pet not found with id ${req.params.id}`, 404));
  }
  
  // Make sure user owns the pet
  if (pet.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to access this pet', 401));
  }
  
  res.status(200).json({
    success: true,
    data: pet
  });
}));

// @desc    Create new pet
// @route   POST /api/pets
// @access  Private
router.post('/', protect, asyncHandler(async (req, res, next) => {
  // Add owner to req.body
  req.body.owner = req.user.id;
  
  const pet = await Pet.create(req.body);
  
  res.status(201).json({
    success: true,
    data: pet
  });
}));

// @desc    Update pet
// @route   PUT /api/pets/:id
// @access  Private
router.put('/:id', protect, asyncHandler(async (req, res, next) => {
  let pet = await Pet.findById(req.params.id);
  
  if (!pet) {
    return next(new ErrorResponse(`Pet not found with id ${req.params.id}`, 404));
  }
  
  // Make sure user owns the pet
  if (pet.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update this pet', 401));
  }
  
  pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: pet
  });
}));

// @desc    Delete pet
// @route   DELETE /api/pets/:id
// @access  Private
router.delete('/:id', protect, asyncHandler(async (req, res, next) => {
  const pet = await Pet.findById(req.params.id);
  
  if (!pet) {
    return next(new ErrorResponse(`Pet not found with id ${req.params.id}`, 404));
  }
  
  // Make sure user owns the pet
  if (pet.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to delete this pet', 401));
  }
  
  await pet.deleteOne();
  
  res.status(200).json({
    success: true,
    data: {}
  });
}));

module.exports = router;