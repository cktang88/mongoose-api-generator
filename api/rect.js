//@ts-check
const { Router } = require("express");
const generatorPath = `${process.cwd()}/framework/core/apiGenerator.js`;
const generateResource = require(generatorPath);
const {
  create,
  list,
  get,
  update,
  remove,
  checkOwnerPermission,
  allowed,
} = generateResource("rect", {"list":"PUBLIC","get":"PUBLIC","update":"OWNER","remove":"NONE"} || {});

let router = Router();

// everyone allowed to create?
router.post("/", create);
// list all is special - will actually modify to filter all that is by owner only...
router.get("/", list);

router.get("/:_id", checkOwnerPermission(allowed.get), get);
router.patch("/:_id", checkOwnerPermission(allowed.update), update);
router.delete("/:_id", checkOwnerPermission(allowed.remove), remove);

module.exports = router;
