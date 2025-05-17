const Article = require('../models/Article');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// Get all articles
exports.getArticles = asyncHandler(async (req, res, next) => {
  const articles = await Article.find().sort({ date: -1 });
  res.status(200).json({ success: true, data: articles });
});

// Add new article (vet only)
exports.createArticle = asyncHandler(async (req, res, next) => {
  req.body.author = req.user.id;
  req.body.authorName = req.user.name;
  if (req.file) {
    req.body.image = `/uploads/${req.file.filename}`;
  }
  const article = await Article.create(req.body);
  res.status(201).json({ success: true, data: article });
});