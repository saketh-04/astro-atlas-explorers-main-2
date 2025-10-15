const express = require('express');
const router = express.Router();
const Collection = require('../models/Collection');

// ✅ GET all collections
router.get('/', async (req, res) => {
  try {
    const collections = await Collection.find();
    res.json(collections);
  } catch (error) {
    console.error('❌ Error fetching collections:', error);
    res.status(500).json({ message: 'Server error while fetching collections' });
  }
});

// ✅ POST - Create a new collection
router.post('/', async (req, res) => {
  console.log('📦 Incoming Collection body:', req.body);

  try {
    // Handle missing or empty name field
    if (!req.body.name || req.body.name.trim().length < 3) {
      return res.status(400).json({ message: 'Collection name must be at least 3 characters long' });
    }

    // Create a new collection document with defaults for optional fields
    const collectionData = {
      name: req.body.name,
      items: req.body.items ?? 0,
      shared: req.body.shared ?? false,
      color: req.body.color || 'from-blue-500 to-cyan-500',
      description: req.body.description || '',
      created: req.body.created || new Date().toISOString().split('T')[0],
      lastModified: req.body.lastModified || new Date().toISOString().split('T')[0],
    };

    const collection = new Collection(collectionData);
    const savedCollection = await collection.save();

    console.log('✅ Collection created successfully:', savedCollection._id);
    res.status(201).json(savedCollection);

  } catch (error) {
    console.error('❌ Collection creation error:', error);
    res.status(400).json({
      message: error.message || 'Failed to create collection',
      error: error.errors || null,
    });
  }
});

// ✅ PUT - Update a collection by ID
router.put('/:id', async (req, res) => {
  console.log('🛠 Updating Collection ID:', req.params.id);
  console.log('📝 Update Data:', req.body);

  try {
    req.body.lastModified = new Date().toISOString().split('T')[0];

    const updatedCollection = await Collection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCollection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    console.log('✅ Collection updated:', updatedCollection._id);
    res.json(updatedCollection);

  } catch (error) {
    console.error('❌ Collection update error:', error);
    res.status(400).json({ message: error.message });
  }
});

// ✅ DELETE - Remove a collection by ID
router.delete('/:id', async (req, res) => {
  console.log('🗑 Deleting Collection ID:', req.params.id);

  try {
    const deleted = await Collection.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    console.log('✅ Collection deleted:', deleted._id);
    res.sendStatus(204);

  } catch (error) {
    console.error('❌ Collection delete error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
