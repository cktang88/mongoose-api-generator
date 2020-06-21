require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const authRouter = require("./framework/auth/authRouter");
const apiRouter = require("./framework/core/api.js");
const pino = require("pino-http")();
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

// allowed for all origins
app.use(cors());

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(pino);

// subroutes
app.use("/auth", authRouter);
app.use("/api", apiRouter);

// start server
if (process.env.NODE_ENV !== "test")
  app.listen(port, () => console.log(`Listening on port ${port}`));

// for testing
module.exports = app;
