// routes/kpi.js
const express = require("express");
const router = express.Router();
const kpiController = require("../controllers/kpi");

// Define the routes for each KPI type
router.get("/booking/:hotelId/:specificDate?", kpiController.getKpisBooking);
router.get("/customer/:hotelId/:specificDate?", kpiController.getKpisCustomer);
router.get("/cancelled/:hotelId/:specificDate?", kpiController.getKpisCancelled);

module.exports = router;

