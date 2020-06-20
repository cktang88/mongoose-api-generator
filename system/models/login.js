const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const loginSchema = new Schema(
  {
    created: { type: Date, default: Date.now },
    username: String,
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  { strict: "throw" }
);

module.exports = mongoose.model("login", loginSchema);
