const requireDir = require("require-dir");
const mongoose = require("mongoose");
const path = require("path");
// disable auto-pluralizing collection names
mongoose.pluralize(null);
// fix deprecation warnings
if (process.env.NODE_ENV !== "test")
  mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
console.log(process.env.MODELS_DIR);
// relative path to root of project
const modelsDir = path.resolve(".", process.env.MODELS_DIR || "models");
// custom user models
const files = requireDir(modelsDir);
console.log(files);
const APIPermissions = {};
const models = Object.entries(files).map(([name, { schema, permissions }]) => {
  console.log(`Discovered: '${name}'`);
  APIPermissions[name] = permissions;
  return mongoose.model(name, schema);
});

module.exports = { models, APIPermissions };
