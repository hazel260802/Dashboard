const express = require('express');
const router = express.Router();
const kpiController = require('../controllers/kpi');

// Kpi Route
router.get('/kpi', kpiController.updateKpi);

module.exports = router;
