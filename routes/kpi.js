// routes/kpi.js
const express = require("express");
const router = express.Router();
const kpiController = require("../controllers/kpi");

// Define the routes for each KPI type
router.get("/booking", kpiController.getKpisBooking);
router.get("/customer", kpiController.getKpisCustomer);
router.get("/cancelled", kpiController.getKpisCancelled);

module.exports = router;

