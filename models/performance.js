const mongoose = require("mongoose");

const PerformanceSchema = new mongoose.Schema({
    date: {
        type: Date,
    },
    sales: {
        type: Number,
    },
    booking: {
        type: Number,
    },
    customers: {
        type: Number,
    },
});

module.exports = mongoose.model("Performance", PerformanceSchema);