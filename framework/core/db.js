const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

const { MONGODB_URL, MODELS_DIR, RESOURCES_FILE_DIR } = process.env;

// disable auto-pluralizing collection names
mongoose.pluralize(null);
// fix deprecation warnings
console.log(`Connecting mongodb at ${MONGODB_URL}`);
mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const APIPermissions = {};

// relative path to root of project
const modelsDir = path.join(`${process.cwd()}`, MODELS_DIR || "models");

const files = fs.readdirSync(modelsDir).map((name) => path.parse(name).name);

// create Mongoose models from file
const models = files.map((name) => {
  const { schema, permissions } = require(`${modelsDir}/${name}`);
  console.log(`Discovered: '${name}'`);
  APIPermissions[name] = permissions;
  return mongoose.model(name, schema);
});

// write out client-side files
let str = `enum Resources {
${files.map((name) => `${name} = "${name}"\n`)}
} export default Resources;`;
try {
  const dir = path.join(`${process.cwd()}`, RESOURCES_FILE_DIR || "client/src");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const fileName = dir + "/apiResources.ts";
  fs.writeFileSync(fileName, str);
  console.log("Updated resources file: " + fileName);
} catch (err) {
  console.error(err);
}

// *** doesn't work for tests... ***
// const requireDir = require("require-dir");
// const files = requireDir(modelsDir);
// const models = Object.entries(files).map(([name, { schema, permissions }]) => {
//   console.log(`Discovered: '${name}'`);
//   APIPermissions[name] = permissions;
//   return mongoose.model(name, schema);
// });

module.exports = { mongoose, models, APIPermissions };
