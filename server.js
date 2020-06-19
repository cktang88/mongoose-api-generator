require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const models = require("./db");
const crud = require("./crud");
const pino = require("pino-http")();

const passport = require("passport");
const jwt = require("jsonwebtoken");
// setup passport
require("./passport");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(pino);

/* POST login. */
router.post("/login", function (req, res, next) {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    console.log(err);
    if (err || !user) {
      return res.status(400).json({
        message: info ? info.message : "Login failed",
        user: user,
      });
    }

    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }

      const token = jwt.sign(user, process.env.JWT_SECRET);

      return res.json({ user, token });
    });
  })(req, res);
});

/* GET user profile. */
router.get("/profile", function (req, res, next) {
  res.send(req.user);
});

// Autogenerate CRUD endpoints for each model schema
models.forEach((model) => {
  app.use(`/api/${model.collection.collectionName}`, crud(model));
});

// Server
app.listen(port, () => console.log(`Listening on port ${port}`));
