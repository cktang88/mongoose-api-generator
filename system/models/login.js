const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = new Schema(
  {
    created: { type: Date, default: Date.now },
    email: String,
    password: String,
  },
  { strict: "throw" }
);
