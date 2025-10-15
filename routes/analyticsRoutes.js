const express = require('express');
const router = express.Router();
const controller = require('../controllers/analyticsController');

router.get('/logs', controller.getLogs);

module.exports = router;
