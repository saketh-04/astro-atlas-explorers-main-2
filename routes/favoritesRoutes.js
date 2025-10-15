const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');

// GET all favorites
router.get('/', async (req, res) => {
  try {
    const favorites = await Favorite.find();
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Create a favorite
router.post('/', async (req, res) => {
  try {
    const favorite = new Favorite(req.body);
    await favorite.save();
    res.status(201).json(favorite);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT - Update favorite by ID
router.put('/:id', async (req, res) => {
  try {
    const favorite = await Favorite.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(favorite);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE - Remove favorite by ID
router.delete('/:id', async (req, res) => {
  try {
    await Favorite.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
