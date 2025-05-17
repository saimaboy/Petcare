const Product = require('../models/Product');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// Get all products
exports.getProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({ success: true, count: products.length, data: products });
});

// Get pharmacy products
exports.getPharmacyProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({ pharmacy: req.user.id });
  res.status(200).json({ success: true, count: products.length, data: products });
});

// Get single product
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }
  res.status(200).json({ success: true, data: product });
});

// Create new product
exports.createProduct = asyncHandler(async (req, res, next) => {
  req.body.pharmacy = req.user.id;
  req.body.pharmacyName = req.user.businessName || req.user.name;

  // Handle image upload if req.file exists
  if (req.file) {
    req.body.image = `/uploads/${req.file.filename}`;
  }

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    data: product,
  });
});

// Update product
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is product owner
  if (
    product.pharmacy.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this product`, 403));
  }

  req.body.pharmacy = req.user.id;
  req.body.pharmacyName = req.user.businessName || req.user.name;

  // Handle image upload if req.file exists
  if (req.file) {
    req.body.image = `/uploads/${req.file.filename}`;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: product,
  });
});

// Delete product
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is product owner
  if (
    product.pharmacy.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this product`, 403));
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// Search products
exports.searchProducts = asyncHandler(async (req, res, next) => {
  const { query } = req.query;
  if (!query) {
    return res.status(200).json({ success: true, data: [] });
  }
  
  const products = await Product.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } }
    ]
  });
  
  res.status(200).json({ success: true, count: products.length, data: products });
});