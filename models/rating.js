const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema({
    hotelId: {
        type: String,
    },
    wonderful: {
        type: Number,
    },
    good: {
        type: Number,
    },
    average: {
        type: Number,
    },
    poor: {
        type: Number,
    },
    terrible: {
        type: Number,
    },
    // negativeWords: {
    //     type: Object,
    // },
});

module.exports = mongoose.model("Rating", RatingSchema);