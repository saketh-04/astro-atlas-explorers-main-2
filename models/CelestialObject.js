const mongoose = require('mongoose');

const CelestialObjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  distance: { type: Number, required: true },
  description: { type: String },
  imageUrl: { type: String },
  mass: { type: String },
  discoveryDate: { type: Date }
});

module.exports = mongoose.model('CelestialObject', CelestialObjectSchema);
