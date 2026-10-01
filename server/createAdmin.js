require("dotenv").config();

const bcrypt = require("bcryptjs");
const pool = require("./src/config/db");

const createAdmin = async () => {
  try {
    const name = "RateNest System Administrator";
    const email = "admin@ratenest.com";
    const password = "Admin@123";
    const address = "Pune, Maharashtra, India";

    const [existingUsers] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      console.log("Admin already exists.");
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users
       (name, email, password_hash, address, role)
       VALUES (?, ?, ?, ?, 'ADMIN')`,
      [name, email, passwordHash, address]
    );

    console.log("Admin created successfully.");
    console.log("Email:", email);
    console.log("Password:", password);

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();