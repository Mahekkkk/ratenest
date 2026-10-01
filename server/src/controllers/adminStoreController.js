const pool = require("../config/db");

const createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    if (ownerId) {
      const [owners] = await pool.query(
        "SELECT id FROM users WHERE id = ? AND role = 'STORE_OWNER'",
        [ownerId]
      );

      if (owners.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid store owner",
        });
      }
    }

    const [result] = await pool.query(
      `INSERT INTO stores (name, email, address, owner_id)
       VALUES (?, ?, ?, ?)`,
      [name, email, address, ownerId || null]
    );

    res.status(201).json({
      success: true,
      message: "Store created successfully",
      storeId: result.insertId,
    });
  } catch (error) {
    console.error("Create store error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create store",
    });
  }
};


const getStores = async (req, res) => {
  try {
    const {
      name = "",
      email = "",
      address = "",
      sortBy = "name",
      order = "asc",
    } = req.query;

    const allowedSortFields = {
      name: "s.name",
      email: "s.email",
      address: "s.address",
      rating: "overall_rating",
    };

    const sortColumn = allowedSortFields[sortBy] || "s.name";
    const sortOrder = order.toLowerCase() === "desc" ? "DESC" : "ASC";

    let query = `
      SELECT
        s.id,
        s.name,
        s.email,
        s.address,
        COALESCE(ROUND(AVG(r.rating), 2), 0) AS overall_rating
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      WHERE 1 = 1
    `;

    const params = [];

    if (name) {
      query += " AND s.name LIKE ?";
      params.push(`%${name}%`);
    }

    if (email) {
      query += " AND s.email LIKE ?";
      params.push(`%${email}%`);
    }

    if (address) {
      query += " AND s.address LIKE ?";
      params.push(`%${address}%`);
    }

    query += `
      GROUP BY s.id, s.name, s.email, s.address
      ORDER BY ${sortColumn} ${sortOrder}
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
  createStore,
  getStores,
};