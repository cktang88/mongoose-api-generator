const { Schema } = require("mongoose");
const { PUBLIC, OWNER, NONE } = require("../system/auth/permissions");
const schema = new Schema(
  {
    width: Number,
    height: Number,
    created: { type: Date, default: Date.now },
    name: String,
  },
  { strict: "throw" }
);

const permissions = {
  list: PUBLIC,
  get: PUBLIC,
  update: OWNER,
  remove: NONE,
};

module.exports = { schema, permissions };
