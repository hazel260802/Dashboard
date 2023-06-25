const mysql = require("mysql");
const mongoose = require("mongoose");

require("dotenv").config();

module.exports = mySQLConnect();
mongoDBConnect();

function mySQLConnect() {
  try {
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT,
    });
    connection.connect((err) => {
      if (err) console.log(err);
      else console.log("MySQL connected success");
    });
    return connection;
  } catch (error) {
    console.log(error);
  }
}

async function mongoDBConnect() {
  try {
    mongoose.set("strictQuery", false);
    mongoose
      .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("MongoDB connected success");
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
    process.exit();
  }
}
