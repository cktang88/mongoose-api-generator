const { Router } = require("express");

const { signup, login, jwtAuthGuard } = require("./auth");

const authRouter = Router();

authRouter.post("/signup", async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res
      .status(400)
      .send("Invalid input. Requires username, email, and password.");
    return;
  } else {
    await signup(req.body, res);
  }
});
authRouter.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    res.status(400).send("Invalid input. Requires email and password.");
  else await login(req.body, res);
});
authRouter.get("/profile", jwtAuthGuard, (req, res, next) => {
  res.send(req.user);
});

module.exports = authRouter;
