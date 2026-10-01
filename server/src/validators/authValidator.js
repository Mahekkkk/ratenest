const { body } = require("express-validator");

const userFieldsValidation = [
  body("name")
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage("Name must be between 20 and 60 characters"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address"),

  body("address")
    .trim()
    .isLength({ max: 400 })
    .withMessage("Address cannot exceed 400 characters"),

  body("password")
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be between 8 and 16 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("Password must contain at least one special character"),
];

const registerValidation = userFieldsValidation;

const adminUserValidation = [
  ...userFieldsValidation,
  body("role")
  .isIn(["USER", "ADMIN", "STORE_OWNER"])
    .withMessage("Role must be USER or ADMIN"),
];

module.exports = {
  registerValidation,
  adminUserValidation,
};