const express = require("express");
const {
    submitRating,
    updateRating,
  } = require("../controllers/ratingController");
const authenticate = require("../middleware/auth");
const authorize = require("../middleware/role");


const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("USER"),
  submitRating
);
router.put(
    "/",
    authenticate,
    authorize("USER"),
    updateRating
  );

module.exports = router;