const express = require('express');
const { getArticles, createArticle } = require('../controllers/articleController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.route('/')
  .get(getArticles)
  .post(protect, authorize('veterinarian'), upload.single('image'), createArticle);
  
module.exports = router;