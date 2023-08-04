// controllers/kpi.js
const cron = require("node-cron");
const { connection, saved_connection } = require("../database");


const createKpisTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS kpis (
      id INT PRIMARY KEY AUTO_INCREMENT,
      title VARCHAR(255) NOT NULL,
      metric INT NOT NULL,
      progress INT NOT NULL,
      delta FLOAT NOT NULL,
      deltaType VARCHAR(255) NOT NULL
    )
  `;
  saved_connection.query(createTableQuery, (error) => {
    if (error) {
      console.log("Error creating kpis table:", error);
      throw error;
    } else {
      console.log("Kpis table created or already exists");
    }
  });
};

const updateKpi = async () => {
  try {
    createKpisTable(); // Ensure the kpis table exists

    const query = `SELECT COUNT(*) as total FROM bookings WHERE status = 'completed'`;

    connection.query(query, async (error, results) => {
      if (error) throw error;
      if (results.length === 0) {
        console.log("No new bookings");
      } else {
        console.log("New bookings:", results[0].total, " at (timestamp):", new Date());
        const totalBookings = results[0].total;
        const delta = calculateDelta(totalBookings);
        const deltaType = getDeltaType(totalBookings);

        const insertQuery = `INSERT INTO kpis (title, metric, progress, delta, deltaType)
                            VALUES ('Booking', ${totalBookings}, ${totalBookings}, ${delta}, '${deltaType}')`;

        saved_connection.query(insertQuery, async (error) => {
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

const getKpis = async (req, res) => {
  try {
    createKpisTable(); // Ensure the kpis table exists

    const query = "SELECT * FROM kpis";
    saved_connection.query(query, (error, results) => {
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
    createKpisTable(); // Ensure the kpis table exists

    const query = "SELECT * FROM kpis ORDER BY id DESC LIMIT 1";
    saved_connection.query(query, (error, result) => {
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

// Schedule updateKpi to run once every day at a specific time (1:00 AM)
cron.schedule("0 1 * * *", async () => {
  try {
    await updateKpi();
  } catch (error) {
    console.log("Error updating KPI:", error);
  }
});

module.exports = { getKpis, getLatestKpi };
