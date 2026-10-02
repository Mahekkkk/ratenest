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

    const [usersByRole] = await pool.query(
      "SELECT role, COUNT(*) AS count FROM users GROUP BY role"
    );

    const [ratingsByScore] = await pool.query(
      "SELECT rating, COUNT(*) AS count FROM ratings GROUP BY rating"
    );

    const [ratingsPerDay] = await pool.query(
      `SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS day, COUNT(*) AS count
       FROM ratings
       WHERE created_at >= (CURDATE() - INTERVAL 13 DAY)
       GROUP BY day
       ORDER BY day`
    );

    const [topStores] = await pool.query(
      `SELECT s.id, s.name,
              ROUND(AVG(r.rating), 2) AS average,
              COUNT(r.id) AS ratingCount
       FROM stores s
       INNER JOIN ratings r ON r.store_id = s.id
       GROUP BY s.id, s.name
       ORDER BY average DESC, ratingCount DESC, s.name ASC
       LIMIT 5`
    );

    res.json({
      success: true,
      data: {
        totalUsers: userCount.totalUsers,
        totalStores: storeCount.totalStores,
        totalRatings: ratingCount.totalRatings,
        usersByRole,
        ratingsByScore,
        ratingsPerDay,
        topStores,
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
