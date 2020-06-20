const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = new Schema(
  {
    content: String,
    title: String,
    created: { type: Date, default: Date.now },
  },
  { strict: "throw" }
);
