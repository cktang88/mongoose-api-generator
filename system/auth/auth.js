const passport = require("passport");
const passportJWT = require("passport-jwt");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Login = require("../models/login");

const ExtractJWT = passportJWT.ExtractJwt;

// const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = passportJWT.Strategy;

const signup = ({ username, email, password }, res) => {
  Login.findOne({ email: email }).then((user) => {
    if (user) {
      let error = "Email Address Exists in Database.";
      return res.status(400).json(error);
    } else {
      const newUser = new Login({
        username,
        email,
        password,
      });
      bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => res.status(400).json(err));
        });
      });
    }
  });
};

const login = ({ email, password }, res) =>
  Login.findOne({ email }).then((user) => {
    if (!user) {
      errors.email = "No Account Found";
      return res.status(404).json(errors);
    }
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        const payload = {
          id: user._id,
          username: user.username,
        };
        jwt.sign(payload, secret, { expiresIn: 36000 }, (err, token) => {
          if (err)
            res.status(500).json({ error: "Error signing token", raw: err });
          res.json({
            success: true,
            token: `Bearer ${token}`,
          });
        });
      } else {
        errors.password = "Password is incorrect";
        res.status(400).json(errors);
      }
    });
  });

const opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};
passport.use(
  new JWTStrategy(opts, (jwtPayload, cb) =>
    Login.findOneById(jwtPayload.id)
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
};
