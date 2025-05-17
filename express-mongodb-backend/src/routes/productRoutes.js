const express = require('express');
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

// Search route
router.route('/search').get(searchProducts);

// Pharmacy products route
router.route('/pharmacy').get(protect, authorize('pharmacist'), getPharmacyProducts);

// Standard CRUD routes
router
  .route('/')
  .get(getProducts)
  .post(protect, authorize('pharmacist'), createProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(protect, authorize('pharmacist'), updateProduct)
  .delete(protect, authorize('pharmacist'), deleteProduct);

module.exports = router;