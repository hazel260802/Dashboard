const express = require('express');
const router = express.Router();
const performanceController = require('../controllers/performance');

// Performance Route
router.get('/performance', performanceController.updatePerformance);

module.exports = router;
