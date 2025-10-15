const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  location: String,
  language: String,
  bio: String,
  darkMode: String,
  notifications: String,
  privacy: String,
  level: Number,
  achievements: Number,
  memberSince: String,
  isActive: Boolean
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
