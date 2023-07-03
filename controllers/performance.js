// controllers/performance.js
const connection = require("../database");
const { runInterval } = require("../utils/schedule");

const updatePerformance = async () => {
  try {
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
        console.log("Performance data:", results.length);
      }

      for (const result of results) {
        const { date, sales, bookings, customers } = result;

        const existingPerformanceQuery = `
          SELECT * FROM performances WHERE date = '${date}'
        `;

        connection.query(existingPerformanceQuery, async (error, existingPerformance) => {
          if (error) throw error;

          if (existingPerformance.length > 0) {
            const updateQuery = `
              UPDATE performances
              SET sales = ${sales}, bookings = ${bookings}, customers = ${customers}
              WHERE date = '${date}'
            `;

            connection.query(updateQuery, async (error) => {
              if (error) throw error;
            });
          } else {
            const insertQuery = `
              INSERT INTO performances (date, sales, bookings, customers)
              VALUES ('${date}', ${sales}, ${bookings}, ${customers})
            `;

            connection.query(insertQuery, async (error) => {
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

// Rest of the code remains the same

module.exports = {
  updatePerformance,
  getAllPerformances,
  getLatestPerformance,
};
