const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/rating');

// Rating Route
router.get('/rating', ratingController.updateRatings);

module.exports = router;
