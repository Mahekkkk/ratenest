const express = require("express");
const { getOwnerDashboard } = require("../controllers/ownerController");
const authenticate = require("../middleware/auth");
const authorize = require("../middleware/role");

const router = express.Router();

router.get(
  "/dashboard",
  authenticate,
  authorize("STORE_OWNER"),
  getOwnerDashboard
);

module.exports = router;