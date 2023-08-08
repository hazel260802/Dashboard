// controllers/rating.js
const { connection } = require("../database");
const cron = require("node-cron");

const createRatingsTable = () => {
  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS ratings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    hotel_id BIGINT UNSIGNED NOT NULL,
    wonderful INT NOT NULL DEFAULT 0,
    good INT NOT NULL DEFAULT 0,
    average INT NOT NULL DEFAULT 0,
    poor INT NOT NULL DEFAULT 0,
    terrible INT NOT NULL DEFAULT 0
  )
`;
  connection.query(createTableQuery, (error) => {
    if (error) {
      console.log("Error creating ratings table:", error);
      throw error;
    }
    console.log("Ratings table created or already exists");
  });
};

const updateRatings = async () => {
  try {
    createRatingsTable(); // Ensure the ratings table exists

    // Query to retrieve newly added comments and their ratings
    const query = `SELECT hotel_id, rate, COUNT(*) AS count FROM comments GROUP BY hotel_id, rate`;

    connection.query(query, async (error, results) => {
      if (error) throw error;
      if (results.length == 0) {
        console.log("No new rating");
      } else {
        // Log the current timestamp of new ratings
        console.log(
          "New ratings: ",
          results.length,
          " at (timestamp):",
          new Date()
        );
      }

      for (const result of results) {
        const { hotel_id, rate, count } = result;

        const existingRatingsQuery = `
          SELECT * FROM ratings WHERE hotel_id = ${hotel_id}
        `;

        connection.query(
          existingRatingsQuery,
          async (error, existingRatings) => {
            if (error) throw error;

            if (existingRatings.length > 0) {
              const updateQuery = `
              UPDATE ratings
              SET wonderful = CASE
                WHEN ${rate} >= 4 THEN wonderful + ${count}
                ELSE wonderful
              END,
              good = CASE
                WHEN ${rate} >= 3 AND ${rate} < 4 THEN good + ${count}
                ELSE good
              END,
              average = CASE
                WHEN ${rate} >= 2 AND ${rate} < 3 THEN average + ${count}
                ELSE average
              END,
              poor = CASE
                WHEN ${rate} >= 1 AND ${rate} < 2 THEN poor + ${count}
                ELSE poor
              END,
              terrible = CASE
                WHEN ${rate} < 1 THEN terrible + ${count}
                ELSE terrible
              END
              WHERE hotel_id = ${hotel_id}
            `;

              connection.query(updateQuery, async (error) => {
                if (error) throw error;
              });
            } else {
              const insertQuery = `
              INSERT INTO ratings (hotel_id, wonderful, good, average, poor, terrible)
              VALUES (${hotel_id}, ${rate >= 4 ? count : 0}, ${
                rate >= 3 && rate < 4 ? count : 0
              }, ${rate >= 2 && rate < 3 ? count : 0}, ${
                rate >= 1 && rate < 2 ? count : 0
              }, ${rate < 1 ? count : 0})
            `;

              connection.query(insertQuery, async (error) => {
                if (error) throw error;
              });
            }
          }
        );
      }
    });
  } catch (error) {
    console.log("Error:", error);
  }
};

const getAllRatings = async (req, res) => {
  try {
    const query = "SELECT * FROM ratings";
    connection.query(query, (error, results) => {
      if (error) {
        console.log("Error retrieving ratings:", error);
        res.status(500).json({ error: "Failed to retrieve ratings" });
      } else {
        res.json(results);
      }
    });
  } catch (error) {
    console.log("Error retrieving ratings:", error);
    res.status(500).json({ error: "Failed to retrieve ratings" });
  }
};
const getRatingByHotelId = async (req, res) => {
  const { hotel_id } = req.query;
  try {
    const query = `SELECT * FROM ratings WHERE hotel_id = ${hotel_id}`;
    connection.query(query, (error, result) => {
      if (error) {
        console.log(
          `Error retrieving rating for hotel with id ${hotel_id}:`,
          error
        );
        res.status(500).json({ error: "Failed to retrieve rating" });
      } else {
        if (result.length === 0) {
          res
            .status(404)
            .json({ error: "Rating not found for the specified hotel_id" });
        } else {
          res.json(result[0]); // Assuming there's only one rating for a specific hotel_id
        }
      }
    });
  } catch (error) {
    console.log("Error retrieving rating:", error);
    res.status(500).json({ error: "Failed to retrieve rating" });
  }
};
// Schedule updateRatings to run once every minute
cron.schedule("* * * * *", async () => {
  try {
    await updateRatings();
  } catch (error) {
    console.log("Error updating KPI:", error);
  }
});

module.exports = {
  updateRatings,
  getAllRatings,
  getRatingByHotelId,
};
