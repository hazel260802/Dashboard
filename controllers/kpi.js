// controllers/kpi.js
const connection = require("../database");
const Kpi = require("../models/kpi");
const { runInterval } = require("../utils/schedule");

const updateKpi = async () => {
    try {
      const query = `SELECT COUNT(*) as total FROM bookings WHERE status = 'completed'`;
  
      connection.query(query, async (error, results) => {
        if (error) throw error;
        if (results.length === 0) {
          console.log("No new bookings");
        } else {
          console.log("New bookings:", results[0].total);
          const totalBookings = results[0].total;
  
          const kpi = new Kpi({
            title: "Booking",
            metric: totalBookings,
            progress: totalBookings,
            delta: calculateDelta(totalBookings),
            deltaType: getDeltaType(totalBookings),
          });
  
          await kpi.save();
        }
      });
    } catch (error) {
      console.log("Error:", error);
    }
  };
  
  const calculateDelta = (totalBookings) => {
    // Calculate the percentage of booked status compared to the target
    const target = 1000000; // Replace with your target value
    const percentage = (totalBookings / target) * 100;
    return percentage.toFixed(2); // Round to 2 decimal places
  };
  
  const getDeltaType = (totalBookings) => {
    // Determine the delta type based on the percentage
    if (totalBookings >= 100) {
      return "increase";
    } else if (totalBookings >= 50) {
      return "moderateIncrease";
    } else if (totalBookings >= 25) {
      return "stabilize";
    } else if (totalBookings >= 10) {
      return "moderateDecrease";
    } else {
      return "decrease";
    }
  };
runInterval(updateKpi, process.env.KPI_INTERVAL);

module.exports = { updateKpi };