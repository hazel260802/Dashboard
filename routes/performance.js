// routes/performance.js
const express = require("express");
const router = express.Router();
const performanceController = require("../controllers/performance");

// Define the Performances route
router.get("/", performanceController.getAllPerformances);
router.get("/latest", performanceController.getLatestPerformance);
router.get("/date/:startDate/:endDate", performanceController.getDatePerformances)
module.exports = router;
