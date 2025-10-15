// models/Collection.js
const mongoose = require('mongoose');

const CollectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Collection name is required'],
    minlength: 3,
  },
  items: {
    type: Number,
    default: 0,
  },
  shared: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String,
    default: 'from-blue-500 to-cyan-500',
  },
  description: {
    type: String,
    default: '',
  },
  created: {
    type: String,
    default: () => new Date().toISOString().split('T')[0],
  },
  lastModified: {
    type: String,
    default: () => new Date().toISOString().split('T')[0],
  },
});

module.exports = mongoose.model('Collection', CollectionSchema);
