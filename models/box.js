const { Schema } = require("mongoose");
const { PUBLIC, OWNER, NONE } = require("../framework/auth/permissions");
const schema = new Schema(
  {
    width: Number,
    height: Number,
    created: { type: Date, default: Date.now },
    name: String,
    owner_id: String,
  },
  { strict: "throw", toObject: { versionKey: false } }
);

const permissions = {
  list: PUBLIC,
  get: PUBLIC,
  update: OWNER,
  remove: NONE,
};

module.exports = { schema, permissions };
