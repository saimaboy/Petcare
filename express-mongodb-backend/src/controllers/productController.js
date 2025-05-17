const Product = require('../models/Product');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    Get all products for a pharmacy
 * @route   GET /api/products/pharmacy
 * @access  Private (Pharmacy only)
 */
exports.getPharmacyProducts = asyncHandler(async (req, res, next) => {
  // The pharmacy ID comes from the authenticated user
  const products = await Product.find({ pharmacy: req.user.id });

  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
  });
});

/**
 * @desc    Get single product
 * @route   GET /api/products/:id
 * @access  Public
 */
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

/**
 * @desc    Create new product
 * @route   POST /api/products
 * @access  Private (Pharmacy only)
 */
exports.createProduct = asyncHandler(async (req, res, next) => {
  // Add pharmacy to req.body
  req.body.pharmacy = req.user.id;

  // Check if user is a pharmacy
  if (req.user.role !== 'pharmacist') {
    return next(new ErrorResponse(`User with ID ${req.user.id} is not authorized to add products`, 403));
  }

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    data: product,
  });
});

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private (Pharmacy owner only)
 */
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is product owner
  if (product.pharmacy.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this product`, 403));
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

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private (Pharmacy owner only)
 */
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is product owner
  if (product.pharmacy.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this product`, 403));
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

/**
 * @desc    Get all products (with filtering, sorting, pagination)
 * @route   GET /api/products
 * @access  Public
 */
exports.getProducts = asyncHandler(async (req, res, next) => {
  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  let query = Product.find(JSON.parse(queryStr));

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Product.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const products = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: products.length,
    pagination,
    data: products,
  });
});

/**
 * @desc    Search products by name or description
 * @route   GET /api/products/search
 * @access  Public
 */
exports.searchProducts = asyncHandler(async (req, res, next) => {
  const { term } = req.query;

  if (!term) {
    return next(new ErrorResponse('Please provide a search term', 400));
  }

  const products = await Product.find({
    $text: { $search: term },
  });

  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
  });
});