const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getPharmacyProducts,
  searchProducts
} = require('../controllers/productController');

const router = express.Router();

// Import auth middleware
const { protect, authorize } = require('../middleware/auth');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Search route
router.route('/search').get(searchProducts);

// Pharmacy products route
router.route('/pharmacy').get(protect, authorize('pharmacist'), getPharmacyProducts);

// Standard CRUD routes
router
  .route('/')
  .get(getProducts)
  .post(
    protect,
    authorize('pharmacist'),
    upload.single('image'), // <-- Add multer middleware here
    createProduct
  );

router
  .route('/:id')
  .get(getProduct)
  .put(
    protect,
    authorize('pharmacist'),
    upload.single('image'), // <-- Add multer middleware here for update
    updateProduct
  )
  .delete(protect, authorize('pharmacist'), deleteProduct);

module.exports = router;