const Joi = require("joi");

exports.userSchema = Joi.object({
  username: Joi.string().min(8).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("admin", "student").default("student"),
});
