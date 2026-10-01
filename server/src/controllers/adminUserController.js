const bcrypt = require("bcryptjs");
const pool = require("../config/db");

const createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    const allowedRoles = ["USER", "ADMIN", "STORE_OWNER"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be USER or ADMIN",
      });
    }

    const [existingUsers] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO users
       (name, email, password_hash, address, role)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, passwordHash, address, role]
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("Create user error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create user",
    });
  }
};


const getUsers = async (req, res) => {
  try {
    const {
      name = "",
      email = "",
      address = "",
      role = "",
      sortBy = "name",
      order = "asc",
    } = req.query;

    const allowedSortFields = {
      name: "u.name",
      email: "u.email",
      address: "u.address",
      role: "u.role",
    };

    const sortColumn = allowedSortFields[sortBy] || "u.name";
    const sortOrder = order.toLowerCase() === "desc" ? "DESC" : "ASC";

    let query = `
      SELECT
        u.id,
        u.name,
        u.email,
        u.address,
        u.role,
        s.id AS store_id,
        s.name AS store_name
      FROM users u
      LEFT JOIN stores s ON s.owner_id = u.id
      WHERE 1 = 1
    `;

    const params = [];

    if (name) {
      query += " AND u.name LIKE ?";
      params.push(`%${name}%`);
    }

    if (email) {
      query += " AND u.email LIKE ?";
      params.push(`%${email}%`);
    }

    if (address) {
      query += " AND u.address LIKE ?";
      params.push(`%${address}%`);
    }

    if (role) {
      query += " AND u.role = ?";
      params.push(role);
    }

    query += ` ORDER BY ${sortColumn} ${sortOrder}`;

    const [users] = await pool.query(query, params);

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Get users error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};


module.exports = {
  createUser,
  getUsers,
};