const pool = require("../config/db");

const submitRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    if (!storeId || !rating) {
      return res.status(400).json({
        success: false,
        message: "Store ID and rating are required",
      });
    }

    if (rating < 1 || rating > 5 || !Number.isInteger(Number(rating))) {
      return res.status(400).json({
        success: false,
        message: "Rating must be an integer between 1 and 5",
      });
    }

    const [stores] = await pool.query(
      "SELECT id FROM stores WHERE id = ?",
      [storeId]
    );

    if (stores.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    const [existingRating] = await pool.query(
      "SELECT id FROM ratings WHERE user_id = ? AND store_id = ?",
      [userId, storeId]
    );

    if (existingRating.length > 0) {
      return res.status(409).json({
        success: false,
        message: "You have already rated this store",
      });
    }

    await pool.query(
      `INSERT INTO ratings (user_id, store_id, rating)
       VALUES (?, ?, ?)`,
      [userId, storeId, rating]
    );

    res.status(201).json({
      success: true,
      message: "Rating submitted successfully",
    });
  } catch (error) {
    console.error("Submit rating error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit rating",
    });
  }
};
const updateRating = async (req, res) => {
    try {
      const { storeId, rating } = req.body;
      const userId = req.user.id;
  
      if (!storeId || !rating) {
        return res.status(400).json({
          success: false,
          message: "Store ID and rating are required",
        });
      }
  
      if (rating < 1 || rating > 5 || !Number.isInteger(Number(rating))) {
        return res.status(400).json({
          success: false,
          message: "Rating must be an integer between 1 and 5",
        });
      }
  
      const [existingRating] = await pool.query(
        "SELECT id FROM ratings WHERE user_id = ? AND store_id = ?",
        [userId, storeId]
      );
  
      if (existingRating.length === 0) {
        return res.status(404).json({
          success: false,
          message: "You have not rated this store yet",
        });
      }
  
      await pool.query(
        `UPDATE ratings
         SET rating = ?
         WHERE user_id = ? AND store_id = ?`,
        [rating, userId, storeId]
      );
  
      res.json({
        success: true,
        message: "Rating updated successfully",
      });
    } catch (error) {
      console.error("Update rating error:", error);
  
      res.status(500).json({
        success: false,
        message: "Failed to update rating",
      });
    }
  };

  module.exports = {
    submitRating,
    updateRating,
  };