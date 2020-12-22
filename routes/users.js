const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../middleware/auth");

router.get("/", async (req, res, next) => {
  const user = await User.find({}).select("-password");
  res.status(200).send(user);
});

router.post("/signup", async (req, res, next) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User exists");

  user = new User({
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, 10),
  });

  try {
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/login", async (req, res, next) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");

  const token = jwt.sign(
    { _id: user._id, email: user.email },
    config.get("jwtprivateKey")
  );
  res.status(200).json({
    user: user,
    token: token,
  });
});

router.get("/:id", async (req, res, next) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).send("User Not found");

  res.status(200).send(user);
});

router.put("/:id", auth, async (req, res, next) => {
  let user = await User.findById(req.params.id);

  user.email = req.body.email;
  user.password = await bcrypt.hash(req.body.password, 10);
  user = await user.save();
  res.status(200).send(user);
});

router.delete("/:id", auth, async (req, res, next) => {
  const user = await User.findByIdAndRemove(req.params.id);

  res.status(200).send(user);
});

module.exports = router;
