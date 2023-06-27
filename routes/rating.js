// routes/rating.js
const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/rating");

// Define the getAllRatings route
router.get("/", ratingController.getAllRatings);

module.exports = router;
