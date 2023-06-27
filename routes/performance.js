// routes/performance.js
const express = require("express");
const router = express.Router();
const performanceController = require("../controllers/performance");

// Define the getAllPerformances route
router.get("/", performanceController.getAllPerformances);

// Define the getLatestPerformance route
router.get("/latest", performanceController.getLatestPerformance);

module.exports = router;
