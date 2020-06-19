const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = new Schema(
  {
    content: String,
    created: { type: Date, default: Date.now },
    name: String,
    email: String,
  },
  { strict: "throw" }
);
