const { connection } = require("../database");
const fetchKPIsFromDatabase = async (query, res) => {
  try {
    connection.query(query, (error, results) => {
      if (error) {
        console.log("Error retrieving KPIs:", error);
        res.status(500).json({ error: "Failed to retrieve data" });
      } else {
        const formattedResults = results.map((result) => ({
          ...result,
          date: result.date.toISOString().split("T")[0],
        }));
        res.status(200).json(formattedResults);
      }
    });
  } catch (error) {
    console.log("Error retrieving KPIs:", error);
    res.status(500).json({ error: "Failed to retrieve data" });
  }
};
module.exports = {
  fetchKPIsFromDatabase,
};
