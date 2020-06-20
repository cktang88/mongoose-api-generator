require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const apiRouter = require("./system/generator/api");
const authRouter = require("./system/auth/authRouter");
const pino = require("pino-http")();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(pino);

app.use("/auth", authRouter);
app.use("/api", apiRouter);
// Server
app.listen(port, () => console.log(`Listening on port ${port}`));
