const express = require("express");
const { getStores } = require("../controllers/storeController");
const authenticate = require("../middleware/auth");
const authorize = require("../middleware/role");

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize("USER"),
  getStores
);

module.exports = router;