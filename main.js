const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();

// INTERNAL IMPORT
const connection = require("./src/db/database");
require("./src/cron/periodicWeatherFetch");
const userRouter = require("./src/routes/user");
const { initializeSocket } = require("./src/socket/io");

const app = express();
app.use(cors());
app.use(express.urlencoded());
app.use("/user", userRouter);

const server = http.createServer(app);

initializeSocket(server);

server.listen(process.env.PORT, () => {
  console.log(`server listening on port ${process.env.PORT}`);
});
