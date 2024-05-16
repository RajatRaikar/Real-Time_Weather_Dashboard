// const mysql = require("mysql2");
// const error = require("../error/error");
// const fs = require("fs");

// const connection = mysql.createConnection({
//   host: "mysql",
//   user: "root",
//   password: "password",
//   database: "weather_dashboard"
// });

// connection.connect((err, db) => {
//   if (err) {
//     console.error("Error connecting to database: " + err.stack);
//     return;
//   }
//   console.log("Connected to database");
// });

// module.exports = connection;

const mysql = require("mysql2");
const fs = require("fs");
const retry = require("async-retry");

// MySQL connection configuration
const dbConfig = {
  host: "mysql",
  user: process.env.USER, //"root",
  password: process.env.PASSWORD, //"password",
  database: process.env.DATABASENAME, //"weather_dashboard",
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
};

// Function to connect to MySQL with retry logic
const connectWithRetry = async () => {
  return await retry(
    async (bail) => {
      return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(dbConfig);
        connection.connect((err) => {
          if (err) {
            console.error("Error connecting to database: " + err.stack);
            return reject(err);
          }
          const sqlScript = fs.readFileSync("./src/db/query.sql", "utf-8");

          const queries = sqlScript.split("//").filter((query) => query.trim() !== "");

          queries.forEach((query) => {
            connection.query(query, function (err, result) {
              if (err) throw err;
            });
          });
          console.log("Connected to database");
          resolve(connection);
        });
      });
    },
    {
      retries: 5, // Number of retries
      minTimeout: 2000, // Wait 2 seconds before retrying
    }
  );
};

module.exports = {
  connectWithRetry,
};
