// controllers/performance.js
const cron = require("node-cron");
const { connection, saved_connection } = require("../database");

const createPerformancesTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS performances (
      id INT PRIMARY KEY AUTO_INCREMENT,
      date DATE NOT NULL,
      sales DECIMAL(10, 2) NOT NULL,
      bookings INT NOT NULL,
      customers INT NOT NULL
    )
  `;
  saved_connection.query(createTableQuery, (error) => {
    if (error) {
      console.log("Error creating performances table:", error);
      throw error;
    }
    console.log("Performances table created or already exists");
  });
};

const updatePerformance = async () => {
  try {
    createPerformancesTable(); // Ensure the performances table exists

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Get current month (1-12)
    const currentYear = currentDate.getFullYear(); // Get current year

    const startDate = new Date(currentYear, currentMonth - 1, 1); // Start date of the current month
    const endDate = new Date(currentYear, currentMonth, 0); // End date of the current month

    const formattedStartDate = startDate
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const formattedEndDate = endDate
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const query = `SELECT DATE_FORMAT(book_date, '%Y-%m-%d') 
                  AS date, SUM(total) AS sales, 
                  COUNT(*) AS bookings, 
                  COUNT(DISTINCT customer_id) AS customers 
                  FROM bookings 
                  WHERE status = 'completed' AND book_date >= '${formattedStartDate}' 
                  AND book_date <= '${formattedEndDate}' 
                  GROUP BY date`;

    connection.query(query, async (error, results) => {
      if (error) throw error;

      if (results.length === 0) {
        console.log("No performance data");
      } else {
        console.log("Performance data:", results.length, " at (timestamp):", new Date());
      }

      for (const result of results) {
        const { date, sales, bookings, customers } = result;

        const existingPerformanceQuery = `
          SELECT * FROM performances WHERE date = '${date}'
        `;

        saved_connection.query(existingPerformanceQuery, async (error, existingPerformance) => {
          if (error) throw error;

          if (existingPerformance.length > 0) {
            const updateQuery = `
              UPDATE performances
              SET sales = ${sales}, bookings = ${bookings}, customers = ${customers}
              WHERE date = '${date}'
            `;

            saved_connection.query(updateQuery, async (error) => {
              if (error) throw error;
            });
          } else {
            const insertQuery = `
              INSERT INTO performances (date, sales, bookings, customers)
              VALUES ('${date}', ${sales}, ${bookings}, ${customers})
            `;

            saved_connection.query(insertQuery, async (error) => {
              if (error) throw error;
            });
          }
        });
      }
    });
  } catch (error) {
    console.log("Error:", error);
  }
};

const getAllPerformances = async (req, res) => {
  try {
    createPerformancesTable(); // Ensure the performances table exists

    const query = "SELECT * FROM performances";
    saved_connection.query(query, (error, results) => {
      if (error) {
        console.log("Error retrieving performances:", error);
        res.status(500).json({ error: "Failed to retrieve performances" });
      } else {
        res.json(results);
      }
    });
  } catch (error) {
    console.log("Error retrieving performances:", error);
    res.status(500).json({ error: "Failed to retrieve performances" });
  }
};

const getLatestPerformance = async (req, res) => {
  try {
    createPerformancesTable(); // Ensure the performances table exists

    const query = "SELECT * FROM performances ORDER BY date DESC LIMIT 1";
    saved_connection.query(query, (error, results) => {
      if (error) {
        console.log("Error retrieving latest performance:", error);
        res.status(500).json({ error: "Failed to retrieve latest performance" });
      } else {
        res.json(results[0]);
      }
    });
  } catch (error) {
    console.log("Error retrieving latest performance:", error);
    res.status(500).json({ error: "Failed to retrieve latest performance" });
  }
};

// Schedule updatePerformance to run once every day at a specific time (1:00 AM)
cron.schedule("0 1 * * *", async () => {
  try {
    await updatePerformance();
  } catch (error) {
    console.log("Error updating KPI:", error);
  }
});

module.exports = {
  getAllPerformances,
  getLatestPerformance,
};
