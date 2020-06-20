const mongoose = require("mongoose");
const path = require("path");

// disable auto-pluralizing collection names
mongoose.pluralize(null);
// fix deprecation warnings
console.log(`Connecting mongodb at ${process.env.MONGODB_URL}`);
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const APIPermissions = {};

// relative path to root of project
const modelsDir = path.resolve(".", process.env.MODELS_DIR || "models");

const fs = require("fs");
const files = fs.readdirSync(modelsDir);
const models = files
  .map((name) => path.parse(name).name)
  .map((name) => {
    const { schema, permissions } = require(`${modelsDir}/${name}`);
    console.log(`Discovered: '${name}'`);
    APIPermissions[name] = permissions;
    return mongoose.model(name, schema);
  });

// *** doesn't work for tests... ***
// const requireDir = require("require-dir");
// const files = requireDir(modelsDir);
// const models = Object.entries(files).map(([name, { schema, permissions }]) => {
//   console.log(`Discovered: '${name}'`);
//   APIPermissions[name] = permissions;
//   return mongoose.model(name, schema);
// });

module.exports = { mongoose, models, APIPermissions };
