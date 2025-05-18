const Product = require('../models/Product');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const fs = require('fs');
const path = require('path');

// Helper to build full image URL
const getImageUrl = (req, imagePath) => {
  if (!imagePath) return "";
  // Remove leading slash if present
  const cleanPath = imagePath.replace(/^\/+/, "");
  return `${req.protocol}://${req.get('host')}/${cleanPath}`;
};

// Get all products
exports.getProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find();
  // Add full image URL
  const productsWithImageUrl = products.map(product => ({
    ...product.toObject(),
    image: product.image ? getImageUrl(req, product.image) : "",
  }));
  res.status(200).json({ success: true, count: products.length, data: productsWithImageUrl });
});

// Get pharmacy products
exports.getPharmacyProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({ pharmacy: req.user.id });
  const productsWithImageUrl = products.map(product => ({
    ...product.toObject(),
    image: product.image ? getImageUrl(req, product.image) : "",
  }));
  res.status(200).json({ success: true, count: products.length, data: productsWithImageUrl });
});

// Get single product
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }
  const productWithImageUrl = {
    ...product.toObject(),
    image: product.image ? getImageUrl(req, product.image) : "",
  };
  res.status(200).json({ success: true, data: productWithImageUrl });
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

  // Return product with full image URL
  const productWithImageUrl = {
    ...product.toObject(),
    image: product.image ? getImageUrl(req, product.image) : "",
  };

  res.status(201).json({
    success: true,
    data: productWithImageUrl,
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
    // Optionally delete old image file
    if (product.image) {
      const oldImagePath = path.join(__dirname, '../../', product.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    req.body.image = `/uploads/${req.file.filename}`;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  const productWithImageUrl = {
    ...product.toObject(),
    image: product.image ? getImageUrl(req, product.image) : "",
  };

  res.status(200).json({
    success: true,
    data: productWithImageUrl,
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

  // Optionally delete image file
  if (product.image) {
    const imagePath = path.join(__dirname, '../../', product.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
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

  const productsWithImageUrl = products.map(product => ({
    ...product.toObject(),
    image: product.image ? getImageUrl(req, product.image) : "",
  }));
  
  res.status(200).json({ success: true, count: products.length, data: productsWithImageUrl });
});