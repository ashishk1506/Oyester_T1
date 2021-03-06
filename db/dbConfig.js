require('dotenv').config()
const util = require("util")
const mysql = require("mysql")

let dbConn = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port : 3306,
  multipleStatements: true
})

dbConn.getConnection((err, connection) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to Database");
  }
  if (connection) connection.release();
  return
})

dbConn.query = util.promisify(dbConn.query);
module.exports = dbConn;