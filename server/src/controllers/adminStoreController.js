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

module.exports = {
  createStore,
};