const { saved_connection } = require("../database");
const fetchKPIsFromDatabase = async (query, res) => {
    try {
      saved_connection.query(query, (error, results) => {
        if (error) {
          console.log("Error retrieving KPIs:", error);
          res.status(500).json({ error: "Failed to retrieve data" });
        } else {
            res.status(200).json(results);
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
  