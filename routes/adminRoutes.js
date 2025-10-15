const express = require('express');
const router = express.Router();
const controller = require('../controllers/adminController');

router.delete('/ban/:userId', controller.banUser);
router.post('/objects', controller.addCelestialObject);

module.exports = router;
