const express = require('express');
const router = express.Router();
const celestialController = require('../controllers/celestialController');

router.get('/', celestialController.getAllObjects);
router.post('/', celestialController.createObject);
router.get('/:id', celestialController.getObjectById);
router.put('/:id', celestialController.updateObject);
router.delete('/:id', celestialController.deleteObject);

module.exports = router;
