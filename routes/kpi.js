// routes/kpi.js
const express = require("express");
const router = express.Router();
const kpiController = require("../controllers/kpi");

// Define the getKpis route
router.get("/", kpiController.getKpis);

// Define the getLatestKpi route
router.get("/latest", kpiController.getLatestKpi);

module.exports = router;
