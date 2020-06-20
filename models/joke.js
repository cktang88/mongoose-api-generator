const { Schema } = require("mongoose");
const { PUBLIC, OWNER, NONE } = require("../system/auth/permissions");

module.exports = new Schema(
  {
    content: String,
    title: String,
    created: { type: Date, default: Date.now },
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
