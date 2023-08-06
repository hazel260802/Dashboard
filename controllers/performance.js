// controllers/performance.js
const { saved_connection } = require("../database");
const {
  fetchKPIsFromDatabase,
} = require("../utils/fetchDatabase");

const getAllPerformances = async (req, res) => {
  try {
    const query = `
      SELECT date,
        SUM(CASE WHEN title = 'Sales' THEN totalNumber ELSE 0 END) as Sales,
        SUM(CASE WHEN title = 'Booking' THEN totalNumber ELSE 0 END) as Booking,
        SUM(CASE WHEN title = 'Customer' THEN totalNumber ELSE 0 END) as Customers
      FROM kpis
      GROUP BY date
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
        SUM(CASE WHEN title = 'Sales' THEN totalNumber ELSE 0 END) as Sales,
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
    const { hotelId } = req.params;

    const query = `
      SELECT date,
        SUM(CASE WHEN title = 'Sales' THEN totalNumber ELSE 0 END) as Sales,
        SUM(CASE WHEN title = 'Booking' THEN totalNumber ELSE 0 END) as Booking,
        SUM(CASE WHEN title = 'Customer' THEN totalNumber ELSE 0 END) as Customers
      FROM kpis
      WHERE hotel_id = ${hotelId}
      GROUP BY date
      ORDER BY date DESC
      LIMIT 1;
    `;

    saved_connection.query(query, (error, results) => {
      if (error) {
        console.log("Error retrieving the latest performance:", error);
        res.status(500).json({ error: "Failed to retrieve the latest performance" });
      } else {
        if (results.length > 0) {
          res.status(200).json(results[0]);
        } else {
          res.status(404).json({ message: "Performance data not found for the given hotelId" });
        }
      }
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Failed to retrieve the latest performance" });
  }
};

module.exports = {
  getAllPerformances,
  getDatePerformances,
  getLatestPerformance,
};
