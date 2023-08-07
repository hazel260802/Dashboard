const mysql = require("mysql");
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  timezone: "utc", // Set the timezone to UTC
});


connection.connect((err) => {
  if (err) console.log(err);
  else console.log("MySQL connected successfully");
});

module.exports = {
  connection,
};
