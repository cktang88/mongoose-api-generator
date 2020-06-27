//@ts-check
const { Router } = require("express");
const { models, APIPermissions } = require("./db");
const { jwtAuthGuard } = require("../auth/auth");
const path = require("path");
const fs = require("fs");

const replace = require("replace-in-file");

let apiRouter = Router();

// Autogenerate API endpoints for each model schema
models.forEach((model) => {
  const name = model.collection.collectionName;
  const permissions = APIPermissions[name];
  console.log(`creating API endpoints for /api/${name}`);

  // relative path to root of project
  const outputPath = `${process.cwd()}/api/${name}.js`;
  const inputTemplate = `${process.cwd()}/framework/core/crudTemplate.js`;

  // new file will be created or overwritten by default.
  fs.copyFileSync(inputTemplate, outputPath);

  replace.sync({
    files: outputPath,
    from: /MODEL_NAME/g,
    to: name,
  });
  replace.sync({
    files: outputPath,
    from: /MODEL_PERMISSIONS/g,
    to: JSON.stringify(permissions),
  });
  console.log(`Created /${name}.js`);

  // the jwtAuthGuard populates `req.user` for all child routes
  apiRouter.use(`/${name}`, jwtAuthGuard, require(outputPath));
});
module.exports = apiRouter;
