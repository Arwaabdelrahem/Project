const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

function userValidation(user) {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  });

  return schema.validate(user);
}
const User = mongoose.model("User", userSchema);

module.exports.User = User;
module.exports.validate = userValidation;
