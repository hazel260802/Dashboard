// routes/rating.js
const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/rating");

// Define the Ratings route
router.get("/:hotelId", ratingController.getRatingByHotelId);
router.get("/", ratingController.getAllRatings);


module.exports = router;
