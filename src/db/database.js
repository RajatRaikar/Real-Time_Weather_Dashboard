const mysql = require("mysql");
const error = require("../error/error");
const fs = require("fs");

const connection = mysql.createConnection({
  host: process.env.HOSTNAME,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASENAME
});

connection.connect((err, db) => {
  if (err) {
    console.error("Error connecting to database: " + err.stack);
    return;
  }
  console.log("Connected to database");
});

const sqlScript = fs.readFileSync("./src/db/query.sql", "utf-8");

const queries = sqlScript.split("//").filter((query) => query.trim() !== "");

queries.forEach((query) => {
  connection.query(query, function (err, result) {
    if (err) throw err;
  });
});

module.exports = connection;
