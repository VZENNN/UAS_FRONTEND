const { Pool } = require("pg");
require("dotenv").config();

// Koneksi ke PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || "fashion_user",
    password: process.env.DB_PASS || "your_password",
    database: process.env.DB_NAME || "fashion_store",
});

module.exports = pool;