const express = require("express");
const router = express.Router();
const {
  saveUser,
  login,
  getAll,
  update,
  remove,
  getOne,
} = require("../controllers/users");
const { auth } = require("../middlewares/auth");
const { userSchema } = require("../validation/user.validation");
const { validate } = require("../middlewares/validate");

router.post("/", validate(userSchema), saveUser);

router.post("/login", login);

router.get("/", auth, getAll);

router.get("/:id", auth, getOne);

router.patch("/:id", validate(userSchema), auth, update);

router.delete("/:id", auth, remove);

module.exports = router;
