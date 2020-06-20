const requireDir = require("require-dir");
const mongoose = require("mongoose");
// disable auto-pluralizing collection names
mongoose.pluralize(null);
// fix deprecation warnings
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });

// custom user models
const files = requireDir("../../models");
const APIPermissions = {};
const models = Object.entries(files).map(([name, { schema, permissions }]) => {
  console.log(`Discovered: '${name}'`);
  APIPermissions[name] = permissions;
  return mongoose.model(name, schema);
});

module.exports = { models, APIPermissions };
