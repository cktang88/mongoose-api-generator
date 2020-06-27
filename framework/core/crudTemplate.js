//@ts-check
const { Router } = require("express");
const corePath = `${process.cwd()}/framework/core`;
const generateResource = require(`${corePath}/apiGenerator.js`);
const { models } = require(`${corePath}/db.js`);
const {
  create,
  list,
  get,
  update,
  remove,
  checkOwnerPermission,
  allowed,
} = generateResource("MODEL_NAME", MODEL_PERMISSIONS || {});

let router = Router();

// everyone allowed to create?
router.post("/", create);
// list all is special - will actually modify to filter all that is by owner only...
router.get("/", list);

router.get("/:_id", checkOwnerPermission(allowed.get), get);
router.patch("/:_id", checkOwnerPermission(allowed.update), update);
router.delete("/:_id", checkOwnerPermission(allowed.remove), remove);

module.exports = router;
