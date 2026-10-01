const express = require("express");
const {
    register,
    login,
    changePassword,
  } = require("../controllers/authController");
const { registerValidation } = require("../validators/authValidator");
const validate = require("../middleware/validate");
const authenticate = require("../middleware/auth");
const authorize = require("../middleware/role");
const { changePasswordValidation } = require("../validators/passwordValidator");

const router = express.Router();

router.post("/register", registerValidation, validate, register);

router.post("/login", login);
router.put(
    "/change-password",
    authenticate,
    authorize("USER", "STORE_OWNER"),
    changePasswordValidation,
    validate,
    changePassword
  );

module.exports = router;