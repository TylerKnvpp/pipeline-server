const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const signUpValidation = require("../Validation/SignUpValidation");
const loginValidation = require("../Validation/LoginValidation");

let User = require("../Models/user.model");

router.route("/sign-up").post((req, res) => {
  const request = {
    email: req.body.email,
    password: req.body.password,
  };

  const { error, isValid, field } = signUpValidation(request);
  // Check validation
  if (!isValid) {
    res.json({ error: error, field: field });
    return;
  }

  User.findOne({ email: req.body.email }, (mongoErr, user) => {
    if (user) {
      res.json({ success: false, error: "Email already exists" });
      return;
    }

    const newUser = new User({
      email: req.body.email,
      password: req.body.password,
    });

    // Hash password before saving in database
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save({}, (signUpErr, user) => {
          if (signUpErr) {
            res.json({ success: false, error: signUpErr });
          }

          if (user) {
            // User matched
            // Create JWT Payload
            const payload = {
              id: user._id,
              email: user.email,
            };
            // Sign token
            jwt.sign(
              payload,
              keys.sk,
              {
                expiresIn: 31556926, // 1 year in seconds
              },
              (err, token) => {
                res.json({
                  success: true,
                  token: token,
                  user: user,
                  id: user._id,
                });
              }
            );
          }
        });
      });
    });
  });
});

router.route("/login").post((req, res) => {
  const request = {
    email: req.body.email,
    password: req.body.password,
  };
  const { error, isValid } = loginValidation(request);
  // Check validation
  if (!isValid) {
    return res.status(400).json(error);
  }
  const email = req.body.email;
  const password = req.body.password;
  // Find user by email
  User.findOne({ email }).then((user) => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({
        data: "none",
        success: false,
        error: "Please enter a valid email.",
      });
    }
    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
        };
        // Sign token
        jwt.sign(
          payload,
          keys.sk,
          {
            expiresIn: 31556926, // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: token,
              email: user.email,
              id: user.id,
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ data: "none", success: false, error: "Incorrect password." });
      }
    });
  });
});

module.exports = router;
