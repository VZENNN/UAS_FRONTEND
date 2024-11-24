const pool = require("../config/db");

class OrderItem {
    static async create(orderId, productId, quantity, price) {
        const query = `
            INSERT INTO order_items (order_id, product_id, quantity, price)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [orderId, productId, quantity, price];

        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async getByOrderId(orderId) {
        const query = `
            SELECT oi.*, p.name AS product_name, p.image_url
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = $1;
        `;
        const values = [orderId];

        const result = await pool.query(query, values);
        return result.rows;
    }
}

module.exports = OrderItem;