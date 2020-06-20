const requireDir = require("require-dir");
const mongoose = require("mongoose");
// disable auto-pluralizing collection names
mongoose.pluralize(null);

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });

// custom user models
const customModels = requireDir("../../models");
const exportedModels = Object.entries(customModels).map(([name, model]) => {
  console.log(`Discovered: '${name}'`);
  // console.log(model);
  return mongoose.model(name, model);
});

module.exports = exportedModels;
