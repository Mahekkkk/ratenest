const express = require("express");
const { register, login } = require("../controllers/authController");
const { registerValidation } = require("../validators/authValidator");
const validate = require("../middleware/validate");

const router = express.Router();

router.post("/register", registerValidation, validate, register);

router.post("/login", login);

module.exports = router;