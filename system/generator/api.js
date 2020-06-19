const express = require("express");

module.exports = (Collection) => {
  const create = (req, res) => {
    const newEntry = req.body;
    Collection.create(newEntry, (e, newEntry) => {
      if (e) {
        console.log(`Error inserting: `, e.name, e.message);
        res.status(400).send(e.message);
      } else {
        res.send(newEntry);
      }
    });
  };

  const readMany = (req, res) => {
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

  const readOne = (req, res) => {
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
    Collection.update({ _id: req.params._id }, { $set: changedEntry }, (e) => {
      if (e) {
        console.log(`Error updating: `, e.name, e.message);
        res.status(400).send(e.name, e.message);
      } else {
        res.send(newEntry);
      }
    });
  };

  const remove = (req, res) => {
    Collection.remove({ _id: req.params._id }, (e) => {
      if (e) res.status(500).send(e);
      else res.sendStatus(200);
    });
  };

  let router = express.Router();

  router.post("/", create);
  router.get("/", readMany);
  router.get("/:_id", readOne);
  router.put("/:_id", update);
  router.delete("/:_id", remove);

  return router;
};
