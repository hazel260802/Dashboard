// routes/time.js
const express = require("express");
const router = express.Router();
const timeController = require("../controllers/time"); // Import the time controller

// Define the time-related routes
router.get("/", timeController.getUpdateTime);
router.post("/", timeController.updateUpdateTime);

module.exports = router;
