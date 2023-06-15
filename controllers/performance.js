const connection = require("../database");
const Performance = require("../models/performance");
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

    const query = `SELECT DATE_FORMAT(bookDate, '%Y-%m-%d') AS date, SUM(Total) AS sales, COUNT(*) AS booking, COUNT(DISTINCT CustomerId) AS customers FROM Booking WHERE status = 'Booked' AND BookDate >= '${formattedStartDate}' AND BookDate <= '${formattedEndDate}' GROUP BY date`;

    connection.query(query, async (error, results) => {
      if (error) throw error;

      if (results.length === 0) {
        console.log("No performance data");
      } else {
        console.log("Performance data:", results.length);
      }

      for (const result of results) {
        const { date, sales, booking, customers } = result;

        let existingPerformance = await Performance.findOne({ date });

        if (existingPerformance) {
          existingPerformance.sales = sales;
          existingPerformance.booking = booking;
          existingPerformance.customers = customers;

          await existingPerformance.save();
        } else {
          let newPerformance = new Performance({
            date,
            Sales: sales,
            Booking: booking,
            Customers: customers,
          });

          await newPerformance.save();
        }
      }
    });
  } catch (error) {
    console.log("Error:", error);
  }
};

runInterval(updatePerformance, process.env.PERFORMANCE_INTERVAL);

module.exports = { updatePerformance };
