const express = require("express");
const { getDashboard } = require("../controllers/adminController");
const {
    createUser,
    getUsers,
  } = require("../controllers/adminUserController");
const authenticate = require("../middleware/auth");
const authorize = require("../middleware/role");
const { adminUserValidation } = require("../validators/authValidator");
const validate = require("../middleware/validate");
const { createStore } = require("../controllers/adminStoreController");

const router = express.Router();

router.get(
  "/dashboard",
  authenticate,
  authorize("ADMIN"),
  getDashboard
);
router.post(
    "/users",
    authenticate,
    authorize("ADMIN"),
    adminUserValidation,
    validate,
    createUser
  );
  router.get(
    "/users",
    authenticate,
    authorize("ADMIN"),
    getUsers
  );
  router.post(
    "/stores",
    authenticate,
    authorize("ADMIN"),
    createStore
  );

module.exports = router;