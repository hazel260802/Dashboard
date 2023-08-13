const express = require('express');
const router = express.Router();

// Import your route files
const ratingRoutes = require('./rating');
const kpiRoutes = require('./kpi');
const performanceRoutes = require('./performance');
const timeRoutes = require('./time');

// Combine the route files
router.use('/rating', ratingRoutes);
router.use('/kpi', kpiRoutes);
router.use('/performance', performanceRoutes);
router.use('/time', timeRoutes);

module.exports = router;
