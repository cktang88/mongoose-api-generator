const passport = require("passport");
const passportJWT = require("passport-jwt");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Login = require("./models/login");
// const LocalStrategy = require("passport-local").Strategy;

const { JWT_SECRET } = process.env;

const signup = async ({ username, email, password }, res) => {
  const user = await Login.findOne({ email: email });
  if (user) {
    res.status(400).json("Email Address Exists in Database.");
  } else {
    const newUser = {
      username,
      email,
      password,
    };
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(newUser.password, salt);
      newUser.password = hash;
      const dbUser = await Login.create(newUser);
      console.log(`New user created, ${username}(${email})`);
      res.status(201).send(dbUser);
    } catch (err) {
      console.log(err);
      res.status(400).json(err.message);
    }
  }
};

const login = async ({ email, password }, res) => {
  const user = await Login.findOne({ email });
  if (!user) {
    return res.status(404).json("No Account Found");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    const payload = {
      id: user._id,
      username: user.username,
    };
    jwt.sign(payload, JWT_SECRET, { expiresIn: 36000 }, (err, token) => {
      if (err) res.status(500).json({ error: "Error signing token", raw: err });
      res.json({
        success: true,
        token: `Bearer ${token}`,
      });
    });
  } else {
    res.status(400).json("Password is incorrect");
  }
};

const opts = {
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};
passport.use(
  new passportJWT.Strategy(opts, (jwtPayload, cb) =>
    Login.findById(jwtPayload.id)
      .then((user) => {
        return cb(null, user);
      })
      .catch((err) => {
        console.log(err);
        return cb(err);
      })
  )
);

module.exports = {
  signup,
  login,
  jwtAuthGuard: passport.authenticate("jwt", { session: false }),
};
