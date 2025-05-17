const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: {
  type: String,
  required: true,
  enum: ['Cats', 'Small Pets', 'Dogs', 'Birds', 'Fish']
},
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String, default: "" },
  date: { type: Date, default: Date.now },
  readTime: { type: String, default: "5 min read" },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: { type: String, required: true }
});

module.exports = mongoose.model('Article', ArticleSchema);