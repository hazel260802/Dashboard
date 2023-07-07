const mysql = require("mysql");
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});

const saved_connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_SAVE_DATABASE,
  port: process.env.DB_PORT,
});

connection.connect((err) => {
  if (err) console.log(err);
  else console.log("MySQL connected successfully");
});

saved_connection.connect((err) => {
  if (err) console.log(err);
  else console.log("MySQL to save data connected successfully");
});

module.exports = {
  connection,
  saved_connection,
};
