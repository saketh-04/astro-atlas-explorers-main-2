const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String },
  distance: { type: Number },
  mass: { type: String },
  image: { type: String, required: true },
  views: { type: Number, default: 0 },
  discovered: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
