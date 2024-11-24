const pool = require("../config/db");

const Order = {
    create: async (userId, totalPrice, status = "Pending") => {
        const result = await pool.query(
            `INSERT INTO orders (user_id, total_price, status)
             VALUES ($1, $2, $3) RETURNING *`,
            [userId, totalPrice, status]
        );
        return result.rows[0];
    },

    getAll: async () => {
        const result = await pool.query(
            `SELECT o.id, o.total_price, o.status, o.created_at, u.name AS user_name
             FROM orders o
             INNER JOIN users u ON o.user_id = u.id
             ORDER BY o.created_at DESC`
        );
        return result.rows;
    },

    getByUserId: async (userId) => {
        const result = await pool.query(
            `SELECT o.id, o.total_price, o.status, o.created_at
             FROM orders o
             WHERE o.user_id = $1
             ORDER BY o.created_at DESC`,
            [userId]
        );
        return result.rows;
    },

    getById: async (id) => {
        const result = await pool.query(
            `SELECT o.id, o.total_price, o.status, o.created_at, u.name AS user_name, o.user_id
             FROM orders o
             INNER JOIN users u ON o.user_id = u.id
             WHERE o.id = $1`,
            [id]
        );
        return result.rows[0];
    },

    updateStatus: async (orderId, status) => {
        const query = `
            UPDATE orders
            SET status = $1, updated_at = NOW()
            WHERE id = $2
            RETURNING *;
        `;
        const values = [status, orderId];
        const result = await pool.query(query, values);
        return result.rows[0];
    }
};

module.exports = Order;