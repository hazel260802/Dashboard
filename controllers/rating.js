// controllers/rating.js
const { connection, saved_connection } = require("../database");
const { runInterval } = require("../utils/schedule");

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
  saved_connection.query(createTableQuery, (error) => {
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

    const oneDayAgo = new Date(Date.now() - process.env.RATING_INTERVAL);

    // Format the timestamp for the MySQL query
    const formattedTimestamp = oneDayAgo
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    // Query to retrieve newly added comments and their ratings
    const query = `SELECT hotel_id, rate, COUNT(*) AS count FROM comments WHERE created_at > '${formattedTimestamp}' GROUP BY hotel_id, rate`;

    connection.query(query, async (error, results) => {
      if (error) throw error;
      if (results.length == 0) {
        console.log("No new rating");
      } else {
        // Log the current timestamp of new ratings
        console.log("New ratings: ", results.length, " at (timestamp):", new Date());
      }

      for (const result of results) {
        const { hotel_id, rate, count } = result;

        const existingRatingsQuery = `
          SELECT * FROM ratings WHERE hotel_id = ${hotel_id}
        `;

        saved_connection.query(
          existingRatingsQuery,
          async (error, existingRatings) => {
            if (error) throw error;

            if (existingRatings.length > 0) {
              const updateQuery = `
              UPDATE ratings
              SET wonderful = CASE
                WHEN ${rate} >= 4.5 THEN wonderful + ${count}
                ELSE wonderful
              END,
              good = CASE
                WHEN ${rate} >= 3.5 AND ${rate} < 4.5 THEN good + ${count}
                ELSE good
              END,
              average = CASE
                WHEN ${rate} >= 2.5 AND ${rate} < 3.5 THEN average + ${count}
                ELSE average
              END,
              poor = CASE
                WHEN ${rate} >= 1.5 AND ${rate} < 2.5 THEN poor + ${count}
                ELSE poor
              END,
              terrible = CASE
                WHEN ${rate} < 1.5 THEN terrible + ${count}
                ELSE terrible
              END
              WHERE hotel_id = ${hotel_id}
            `;

              saved_connection.query(updateQuery, async (error) => {
                if (error) throw error;
              });
            } else {
              const insertQuery = `
              INSERT INTO ratings (hotel_id, wonderful, good, average, poor, terrible)
              VALUES (${hotel_id}, ${rate >= 4.5 ? count : 0}, ${
                rate >= 3.5 && rate < 4.5 ? count : 0
              }, ${rate >= 2.5 && rate < 3.5 ? count : 0}, ${
                rate >= 1.5 && rate < 2.5 ? count : 0
              }, ${rate < 1.5 ? count : 0})
            `;

              saved_connection.query(insertQuery, async (error) => {
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
    saved_connection.query(query, (error, results) => {
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

runInterval(updateRatings, process.env.RATING_INTERVAL);

module.exports = {
  updateRatings,
  getAllRatings,
};
