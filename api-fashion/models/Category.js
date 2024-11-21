const pool = require("../config/db");

const Category = {
    getAll: async () => {
        const result = await pool.query(`SELECT * FROM categories ORDER BY created_at DESC`);
        return result.rows;
    },

    create: async (name) => {
        const result = await pool.query(
            `INSERT INTO categories (name)
             VALUES ($1) RETURNING *`,
            [name]
        );
        return result.rows[0];
    },

    update: async (id, name) => {
        const result = await pool.query(
            `UPDATE categories SET name = $1, updated_at = CURRENT_TIMESTAMP
             WHERE id = $2 RETURNING *`,
            [name, id]
        );
        return result.rows[0];
    },

    delete: async (id) => {
        await pool.query(`DELETE FROM categories WHERE id = $1`, [id]);
    },

    findById: async (id) => {
        const result = await pool.query(`SELECT * FROM categories WHERE id = $1`, [id]);
        return result.rows[0];
    },
}

module.exports = Category;