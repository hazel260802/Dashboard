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
        const delta = calculateDelta(totalBookings);
        const deltaType = getDeltaType(totalBookings);

        const insertQuery = `INSERT INTO kpis (title, metric, progress, delta, deltaType)
                            VALUES ('Booking', ${totalBookings}, ${totalBookings}, ${delta}, '${deltaType}')`;

        connection.query(insertQuery, async (error, results) => {
          if (error) throw error;
          console.log("KPI saved successfully");
        });
      }
    });
  } catch (error) {
    console.log("Error:", error);
    throw error; // Re-throw the error to propagate it further if needed
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
const runUpdateKpi = async () => {
  try {
    await updateKpi();
  } catch (error) {
    console.log("Error updating KPI:", error);
  }
};
runInterval(runUpdateKpi, process.env.KPI_INTERVAL);

const getKpis = async (req, res) => {
  try {
    const query = "SELECT * FROM kpis";
    connection.query(query, (error, results) => {
      if (error) {
        console.log("Error retrieving KPIs:", error);
        res.status(500).json({ error: "Failed to retrieve KPIs" });
      } else {
        res.json(results);
      }
    });
  } catch (error) {
    console.log("Error retrieving KPIs:", error);
    res.status(500).json({ error: "Failed to retrieve KPIs" });
  }
};

const getLatestKpi = async (req, res) => {
  try {
    const query = "SELECT * FROM kpis ORDER BY id DESC LIMIT 1";
    connection.query(query, (error, result) => {
      if (error) {
        console.log("Error retrieving latest KPI:", error);
        res.status(500).json({ error: "Failed to retrieve latest KPI" });
      } else {
        res.json(result[0]);
      }
    });
  } catch (error) {
    console.log("Error retrieving latest KPI:", error);
    res.status(500).json({ error: "Failed to retrieve latest KPI" });
  }
};

module.exports = { updateKpi, getKpis, getLatestKpi };
