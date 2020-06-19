const mongoose = require("mongoose");
// disable auto-pluralizing collection names
mongoose.pluralize(null);

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });

const requireDir = require("require-dir");
const files = requireDir("./models");

const models = Object.entries(files).map(([name, model]) => {
  console.log(`Discovered: '${name}'`);
  // console.log(model);
  return mongoose.model(name, model);
});

module.exports = models;
