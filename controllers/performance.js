// controllers/performance.js
const { connection } = require("../database");
const { fetchKPIsFromDatabase } = require("../utils/fetchDatabase");

const getAllPerformances = async (req, res) => {
  try {
    const query = `
      SELECT date,
        SUM(CASE WHEN title = 'Cancelled' THEN totalNumber ELSE 0 END) as Cancelled,
        SUM(CASE WHEN title = 'Booking' THEN totalNumber ELSE 0 END) as Booking,
        SUM(CASE WHEN title = 'Customer' THEN totalNumber ELSE 0 END) as Customers
      FROM kpis
      GROUP BY date, hotel_id
      ORDER BY date DESC
      LIMIT 30;
    `;

    fetchKPIsFromDatabase(query, res);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Failed to retrieve performances" });
  }
};

const getDatePerformances = async (req, res) => {
  try {
    const { startDate, endDate } = req.params;

    const query = `
      SELECT date,
        SUM(CASE WHEN title = 'Cancelled' THEN totalNumber ELSE 0 END) as Cancelled,
        SUM(CASE WHEN title = 'Booking' THEN totalNumber ELSE 0 END) as Booking,
        SUM(CASE WHEN title = 'Customer' THEN totalNumber ELSE 0 END) as Customers
      FROM kpis
      WHERE date BETWEEN '${startDate}' AND '${endDate}'
      GROUP BY date;
    `;

    fetchKPIsFromDatabase(query, res);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Failed to retrieve performances" });
  }
};

const getLatestPerformance = async (req, res) => {
  try {
    const { hotel_id } = req.query;

    const query = `
      SELECT date,
        SUM(CASE WHEN title = 'Cancelled' THEN totalNumber ELSE 0 END) as Cancelled,
        SUM(CASE WHEN title = 'Booking' THEN totalNumber ELSE 0 END) as Booking,
        SUM(CASE WHEN title = 'Customer' THEN totalNumber ELSE 0 END) as Customers
      FROM kpis
      WHERE hotel_id = ${hotel_id}
      GROUP BY date
      ORDER BY date DESC
      LIMIT 1;
    `;

    connection.query(query, (error, results) => {
      if (error) {
        console.log("Error retrieving the latest performance:", error);
        res
          .status(500)
          .json({ error: "Failed to retrieve the latest performance" });
      } else {
        if (results.length > 0) {
          const formattedResults = results.map((result) => ({
            ...result,
            date: result.date.toISOString().split("T")[0],
          }));
          res.status(200).json(formattedResults[0]);
        } else {
          res
            .status(404)
            .json({
              message: "Performance data not found for the given hotel_id",
            });
        }
      }
    });
  } catch (error) {
    console.log("Error:", error);
    res
      .status(500)
      .json({ error: "Failed to retrieve the latest performance" });
  }
};

module.exports = {
  getAllPerformances,
  getDatePerformances,
  getLatestPerformance,
};
