const mongoose = require("mongoose");

// ===============
// Database Config
// ===============
mongoose.connect(
  "mongodb://justfortuts:a1b2c3d4@ds155461.mlab.com:55461/justfortuts",
  { useNewUrlParser: true }
);

const requireDir = require("require-dir");
const files = requireDir("./models");

const models = Object.entries(files).map(([name, model]) =>
  mongoose.model(name, model)
);

module.exports = models;
