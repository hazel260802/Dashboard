// config.js
const config = {
    db: {
      host: '103.173.254.82',
      user: 'dbhuan',
      password: '0866444202',
      port: '3306',
      database: 'doandb',
      pool: {
        min: 1, 
        max: 100, 
        idleTimeoutMillis: 30000
      },
    },
    ratingInterval: parseInt(60000),
  };

module.exports = config;
