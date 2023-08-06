// controllers/kpi.js
const cron = require("node-cron");
const { saved_connection } = require("../database");
const {
  calculateProgress,
  calculateDelta,
  getDeltaType,
} = require("../utils/kpiUtils");
const {
  fetchKPIsFromDatabase,
} = require("../utils/fetchDatabase");

const createKpisTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS kpis (
      id INT PRIMARY KEY AUTO_INCREMENT,
      hotel_id BIGINT UNSIGNED NOT NULL,
      title VARCHAR(255) NOT NULL,
      totalNumber INT NOT NULL,
      progress FLOAT NOT NULL,
      target INT NOT NULL,
      delta FLOAT NOT NULL,
      deltaType VARCHAR(255) NOT NULL,
      date DATE NOT NULL
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

const updateKpiBooking = async () => {
  try {
    createKpisTable(); // Ensure the kpis table exists

    // Get the total bookings and their prices (totalNumber) for each hotel and the previousTotalNumber
    const query = `
      SELECT
        R.hotel_id,
        SUM(BR.price) as totalNumber,
        DATE(B.created_at) as created_at
      FROM bookings AS B
      JOIN booked_rooms AS BR ON B.id = BR.booking_id
      JOIN rooms AS R ON BR.room_id = R.id
      WHERE B.status = 'approved'
      GROUP BY R.hotel_id, DATE(B.created_at)
    `;

    connection.query(query, async (error, results) => {
      if (error) throw error;

      if (results.length === 0) {
        console.log("No new bookings");
      } else {
        for (let i = 0; i < results.length; i++) {
          const currentResult = results[i];
          const { hotel_id, totalNumber, created_at } = currentResult;
          const deltaType = getDeltaType(totalNumber);

          let previousTotalNumber = 0;

          // Fetch previousTotalNumber from the kpis table if it exists
          const fetchPreviousQuery = `
          SELECT totalNumber
          FROM kpis
          WHERE hotel_id = ${hotel_id}
          AND title = 'Booking'
          ORDER BY date DESC
          LIMIT 1;
        `;

          saved_connection.query(
            fetchPreviousQuery,
            async (error, previousResult) => {
              if (error) throw error;

              if (previousResult.length > 0) {
                previousTotalNumber = previousResult[0].totalNumber;
              }

              const target = 1000000;
              const progress = calculateProgress(totalNumber, target);
              const delta = calculateDelta(totalNumber, previousTotalNumber);

              const insertQuery = `
              INSERT INTO kpis (hotel_id, title, totalNumber, progress, target, delta, deltaType, date)
              VALUES (${hotel_id}, 'Booking', ${totalNumber}, ${progress}, ${target}, ${delta}, '${deltaType}', '${created_at}')
              ON DUPLICATE KEY UPDATE
              totalNumber = ${totalNumber},
              progress = ${progress},
              target = ${target},
              delta = ${delta},
              deltaType = '${deltaType}';
            `;

              saved_connection.query(insertQuery, async (error) => {
                if (error) throw error;
              });
            }
          );
        }
      }
    });
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

const updateKpiCustomer = async () => {
  try {
    createKpisTable(); // Ensure the kpis table exists

    // Get the total bookings and their prices (totalNumber) for each hotel and the previousTotalNumber
    const query = `
      SELECT R.hotel_id, DATE(B.created_at) as created_at, COUNT(DISTINCT B.customer_id) as totalNumber
      FROM bookings AS B
      JOIN booked_rooms AS BR ON B.id = BR.booking_id
      JOIN rooms AS R ON BR.room_id = R.id
      GROUP BY R.hotel_id, DATE(B.created_at);
    `;

    connection.query(query, async (error, results) => {
      if (error) throw error;

      if (results.length === 0) {
        console.log("No new customers booked");
      } else {
        for (let i = 0; i < results.length; i++) {
          const currentResult = results[i];
          const { hotel_id, totalNumber, created_at } = currentResult;
          const deltaType = getDeltaType(totalNumber);

          let previousTotalNumber = 0;

          // Fetch previousTotalNumber from the kpis table if it exists
          const fetchPreviousQuery = `
          SELECT totalNumber
          FROM kpis
          WHERE hotel_id = ${hotel_id}
          AND title = 'Customer'
          ORDER BY date DESC
          LIMIT 1;
        `;

          saved_connection.query(
            fetchPreviousQuery,
            async (error, previousResult) => {
              if (error) throw error;

              if (previousResult.length > 0) {
                previousTotalNumber = previousResult[0].totalNumber;
              }

              const progress = calculateProgress(totalNumber);
              const target = 500;
              const delta = calculateDelta(totalNumber, previousTotalNumber);

              const insertQuery = `
              INSERT INTO kpis (hotel_id, title, totalNumber, progress, target, delta, deltaType, date)
              VALUES (${hotel_id}, 'Customer', ${totalNumber}, ${progress}, ${target}, ${delta}, '${deltaType}', '${created_at}')
              ON DUPLICATE KEY UPDATE
              totalNumber = ${totalNumber},
              progress = ${progress},
              target = ${target},
              delta = ${delta},
              deltaType = '${deltaType}';
            `;

              saved_connection.query(insertQuery, async (error) => {
                if (error) throw error;
              });
            }
          );
        }
      }
    });
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

const updateKpiCancelled = async () => {
  try {
    createKpisTable(); // Ensure the kpis table exists

    // Get the total bookings and their prices (totalNumber) for each hotel and the previousTotalNumber
    const query = `
      SELECT
        R.hotel_id,
        COUNT(B.id) as totalNumber,
        DATE(B.created_at) as created_at
      FROM bookings AS B
      JOIN booked_rooms AS BR ON B.id = BR.booking_id
      JOIN rooms AS R ON BR.room_id = R.id
      WHERE B.status = 'cancelled'
      GROUP BY R.hotel_id, DATE(B.created_at);
    `;

    connection.query(query, async (error, results) => {
      if (error) throw error;

      if (results.length === 0) {
        console.log("No new bookings");
      } else {
        for (let i = 0; i < results.length; i++) {
          const currentResult = results[i];
          const { hotel_id, totalNumber, created_at } = currentResult;
          const deltaType = getDeltaType(totalNumber);

          let previousTotalNumber = 0;

          // Fetch previousTotalNumber from the kpis table if it exists
          const fetchPreviousQuery = `
          SELECT totalNumber
          FROM kpis
          WHERE hotel_id = ${hotel_id}
          AND title = 'Booking'
          ORDER BY date DESC
          LIMIT 1;
        `;

          saved_connection.query(
            fetchPreviousQuery,
            async (error, previousResult) => {
              if (error) throw error;

              if (previousResult.length > 0) {
                previousTotalNumber = previousResult[0].totalNumber;
              }

              const target = 100;
              const progress = calculateProgress(totalNumber, target);
              const delta = calculateDelta(totalNumber, previousTotalNumber);

              const insertQuery = `
              INSERT INTO kpis (hotel_id, title, totalNumber, progress, target, delta, deltaType, date)
              VALUES (${hotel_id}, 'Cancelled', ${totalNumber}, ${progress}, ${target}, ${delta}, '${deltaType}', '${created_at}')
              ON DUPLICATE KEY UPDATE
              totalNumber = ${totalNumber},
              progress = ${progress},
              target = ${target},
              delta = ${delta},
              deltaType = '${deltaType}';
            `;

              saved_connection.query(insertQuery, async (error) => {
                if (error) throw error;
              });
            }
          );
        }
      }
    });
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

// Get the data (All APIs in kpi)

const getKpisBooking = async (req, res) => {
  try {
    const { hotelId, specificDate } = req.query;

    let query =
      "SELECT * FROM kpis WHERE title = 'Booking' ORDER BY date DESC LIMIT 30";

    if (hotelId) {
      query += ` AND hotel_id = ${hotelId}`;
    }

    if (specificDate) {
      query += ` AND date = '${specificDate}'`;
    }

    fetchKPIsFromDatabase(query, res);
  } catch (error) {
    console.log("Error retrieving KPIs for booking:", error);
    res.status(500).json({ error: "Failed to retrieve KPIs for booking" });
  }
};

const getKpisCustomer = async (req, res) => {
  try {
    const { hotelId, specificDate } = req.query;

    let query =
      "SELECT * FROM kpis WHERE title = 'Customer' ORDER BY date DESC LIMIT 30";

    if (hotelId) {
      query += ` AND hotel_id = ${hotelId}`;
    }

    if (specificDate) {
      query += ` AND date = '${specificDate}'`;
    }

    fetchKPIsFromDatabase(query, res);
  } catch (error) {
    console.log("Error retrieving KPIs for customer:", error);
    res.status(500).json({ error: "Failed to retrieve KPIs for customer" });
  }
};

const getKpisCancelled = async (req, res) => {
  try {
    const { hotelId, specificDate } = req.query;

    let query =
      "SELECT * FROM kpis WHERE title = 'Cancelled' ORDER BY date DESC LIMIT 30";

    if (hotelId) {
      query += ` AND hotel_id = ${hotelId}`;
    }

    if (specificDate) {
      query += ` AND date = '${specificDate}'`;
    }

    fetchKPIsFromDatabase(query, res);
  } catch (error) {
    console.log("Error retrieving KPIs for cancelled:", error);
    res.status(500).json({ error: "Failed to retrieve KPIs for cancelled" });
  }
};

// Schedule updateKpi to run once every day at a specific time (1:00 AM)
cron.schedule("0 1 * * *", async () => {
  try {
    // Update the KPI data for each category.
    await updateKpiBooking();
    await updateKpiCustomer();
    await updateKpiCancelled();
  } catch (error) {
    console.log("Error updating KPI:", error);
  }
});

module.exports = {
  getKpisBooking,
  getKpisCustomer,
  getKpisCancelled,
};
