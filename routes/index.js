const express = require('express');
const router = express.Router();

// Import your route files
const ratingRoutes = require('./rating');
const kpiRoutes = require('./kpi');
const performanceRoutes = require('./performance');

// Combine the route files
router.use('/ratings', ratingRoutes);
router.use('/kpi', kpiRoutes);
router.use('/performance', performanceRoutes);

module.exports = router;
