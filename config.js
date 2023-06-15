// config.js
const config = {
    db: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      database: process.env.DB_DATABASE,
      pool: {
        min: 1, 
        max: 100, 
        idleTimeoutMillis: 30000
        },
    },
    ratingInterval: parseInt(process.env.RATING_INTERVAL),
  };

module.exports = config;
