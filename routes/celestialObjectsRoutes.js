const express = require('express');
const router = express.Router();
const CelestialObject = require('../models/CelestialObject');

// Debug log to confirm this file loads
console.log('Celestial Objects Route Loaded');

router.post('/', async (req, res) => {
  try {
    console.log('REQ BODY:', req.body); // Debug incoming data
    const obj = new CelestialObject(req.body);
    await obj.save();
    res.status(201).json(obj);
  } catch (err) {
    console.error('POST error:', err);
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const objs = await CelestialObject.find();
    res.json(objs);
  } catch (err) {
    console.error('GET error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
