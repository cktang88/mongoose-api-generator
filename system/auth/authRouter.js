const { Router } = require("express");

// setup passport
const { signup, login } = require("./auth");

const userRouter = Router();

userRouter.post("/signup", async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    res
      .status(400)
      .send("Invalid input. Requires username, email, and password.");
  await signup(req.body, res);
});
userRouter.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    res.status(400).send("Invalid input. Requires email and password.");
  await login(req.body, res);
});
userRouter.get("/profile", (req, res, next) => {
  res.send(req.user || "hi");
});

module.exports = userRouter;
