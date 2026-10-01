const pool = require("../config/db");

const getDashboard = async (req, res) => {
  try {
    const [[userCount]] = await pool.query(
      "SELECT COUNT(*) AS totalUsers FROM users"
    );

    const [[storeCount]] = await pool.query(
      "SELECT COUNT(*) AS totalStores FROM stores"
    );

    const [[ratingCount]] = await pool.query(
      "SELECT COUNT(*) AS totalRatings FROM ratings"
    );

    res.json({
      success: true,
      data: {
        totalUsers: userCount.totalUsers,
        totalStores: storeCount.totalStores,
        totalRatings: ratingCount.totalRatings,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard",
    });
  }
};

module.exports = {
  getDashboard,
};