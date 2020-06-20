const { Router } = require("express");
const { models, APIPermissions } = require("./models");
const { jwtAuthGuard } = require("../auth/auth");
const { PUBLIC, OWNER, NONE } = require("../auth/permissions");

const generateResource = (Collection, allowed) => {
  const create = (req, res) => {
    const newEntry = req.body;
    Collection.create(newEntry, (e, newEntry) => {
      if (e) {
        console.log(`Error inserting: `, e.name, e.message);
        res.status(400).json(e.message);
      } else {
        res.send(newEntry);
      }
    });
  };

  const list = (req, res) => {
    let query = res.locals.query || {};

    Collection.find(query, (e, result) => {
      if (e) {
        res.status(500).send(e);
        console.log(e.message);
      } else {
        res.send(result);
      }
    });
  };

  const get = (req, res) => {
    const { _id } = req.params;

    Collection.findById(_id, (e, result) => {
      if (e) {
        res.status(500).send(e);
        console.log(e.message);
      } else {
        res.send(result);
      }
    });
  };

  const update = (req, res) => {
    const changedEntry = req.body;
    Collection.findOneAndUpdate(
      { _id: req.params._id },
      { $set: changedEntry },
      { returnOriginal: false }, // returns new updated doc
      (e, newEntry) => {
        if (e) {
          console.log(`Error updating: `, e.name, e.message);
          res.status(400).json(e.name, e.message);
        } else {
          res.send(newEntry);
        }
      }
    );
  };

  const remove = (req, res) => {
    Collection.remove({ _id: req.params._id }, (e) => {
      if (e) res.status(500).send(e);
      else res.sendStatus(200);
    });
  };

  // returns a custom middleware
  const checkOwnerPermission = (permission) => {
    return (req, res, next) => {
      if (permission === NONE) {
        res.status(400).send("This endpoint is disabled.").end();
      } else if (permission === OWNER) {
        // special thing happens
        jwtAuthGuard(req, res, next);
        console.log(req.id);
        res.status(400).send("computing space...").end();
      } else {
        // if public or omitted, just passthrough
        next();
      }
    };
  };

  let router = Router();

  // everyone allowed to create?
  router.post("/", create);
  // list all is special - will actually modify to filter all that is by owner only...
  router.get("/", checkOwnerPermission(allowed.list), list);

  router.get("/:_id", checkOwnerPermission(allowed.get), get);
  router.put("/:_id", checkOwnerPermission(allowed.update), update);
  router.delete("/:_id", checkOwnerPermission(allowed.remove), remove);

  return router;
};

let apiRouter = Router();

// Autogenerate API endpoints for each model schema
models.forEach((model) => {
  const name = model.collection.collectionName;
  const permissions = APIPermissions[name];
  apiRouter.use(`/${name}`, jwtAuthGuard, generateResource(model, permissions));
});
module.exports = apiRouter;
