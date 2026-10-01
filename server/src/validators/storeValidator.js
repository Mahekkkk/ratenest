const { body } = require("express-validator");

const storeValidation = [
  body("name")
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage("Store name must be between 20 and 60 characters"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address"),

  body("address")
    .trim()
    .isLength({ max: 400 })
    .withMessage("Address cannot exceed 400 characters"),

  body("ownerId")
    .optional({ nullable: true })
    .isInt()
    .withMessage("Owner ID must be a valid number"),
];

module.exports = {
  storeValidation,
};