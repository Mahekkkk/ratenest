const pool = require("../config/db");

const getStores = async (req, res) => {
  try {
    const { name = "", address = "" } = req.query;
    const userId = req.user.id;

    let query = `
      SELECT
        s.id,
        s.name,
        s.email,
        s.address,
        COALESCE(ROUND(AVG(allRatings.rating), 2), 0) AS overall_rating,
        userRating.rating AS user_rating
      FROM stores s
      LEFT JOIN ratings allRatings
        ON allRatings.store_id = s.id
      LEFT JOIN ratings userRating
        ON userRating.store_id = s.id
        AND userRating.user_id = ?
      WHERE 1 = 1
    `;

    const params = [userId];

    if (name) {
      query += " AND s.name LIKE ?";
      params.push(`%${name}%`);
    }

    if (address) {
      query += " AND s.address LIKE ?";
      params.push(`%${address}%`);
    }

    query += `
      GROUP BY
        s.id,
        s.name,
        s.email,
        s.address,
        userRating.rating
      ORDER BY s.name ASC
    `;

    const [stores] = await pool.query(query, params);

    res.json({
      success: true,
      data: stores,
    });
  } catch (error) {
    console.error("Get stores error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch stores",
    });
  }
};

module.exports = {
  getStores,
};