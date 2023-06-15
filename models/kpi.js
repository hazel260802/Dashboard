const mongoose = require("mongoose");

const KpiSchema = new mongoose.Schema({
    title: {
        type: String,
        enum: ['Sales', 'Booking', 'Cancelled'],
    },
    metric: {
        type: Number,
    },
    progress: {
        type: Number,
    },
    target: {
        type: Number,
        default: 1000000,
    },
    delta: {
        type: Number,
    },
    deltaType: {
        type: String,
        enum: ['increase', 'moderateIncrease', 'decrease', 'moderateDecrease', 'stabilize']
    },
});

module.exports = mongoose.model("Kpi", KpiSchema);