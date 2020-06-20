const { model, Schema } = require("mongoose");

const loginSchema = new Schema(
  {
    created: { type: Date, default: Date.now },
    username: String,
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  { strict: "throw", toObject: { versionKey: false } }
);

module.exports = model("login", loginSchema);
