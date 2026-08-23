const express = require("express");
const v1router = require("./routes/");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const socket = require("socket.io");
const intializeSocket = require("./config/socket");

require("dotenv").config();

require("./config/db");
require("./service/cronJobs");
const app = express();
app.set("trust proxy", 1);

const server = http.createServer(app);
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
intializeSocket(server);
app.use("/api/v1", v1router);

server.listen(process.env.PORT, () => {
  console.log("server started at 3000");
});
