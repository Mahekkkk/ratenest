const pool = require("../config/db");

const getOwnerDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const [stores] = await pool.query(
      `
      SELECT
        s.id,
        s.name,
        s.email,
        s.address,
        COALESCE(ROUND(AVG(r.rating), 2), 0) AS average_rating
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      WHERE s.owner_id = ?
      GROUP BY
        s.id,
        s.name,
        s.email,
        s.address
      ORDER BY s.name ASC
      `,
      [ownerId]
    );

    const [ratings] = await pool.query(
      `
      SELECT
        s.id AS store_id,
        s.name AS store_name,
        u.id AS user_id,
        u.name AS user_name,
        u.email AS user_email,
        r.rating,
        r.created_at
      FROM stores s
      INNER JOIN ratings r ON r.store_id = s.id
      INNER JOIN users u ON u.id = r.user_id
      WHERE s.owner_id = ?
      ORDER BY r.created_at DESC
      `,
      [ownerId]
    );

    res.json({
      success: true,
      data: {
        stores,
        ratings,
      },
    });
  } catch (error) {
    console.error("Owner dashboard error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load owner dashboard",
    });
  }
};

module.exports = {
  getOwnerDashboard,
};