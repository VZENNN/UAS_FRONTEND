const pool = require("../config/db");

const Cart = {
    getCurrentPrice: async (product_id) => {
        const result = await pool.query("SELECT price FROM products WHERE id = $1", [product_id]);
        return result.rows[0]?.price || null;
    },

    getCartItem: async (user_id, product_id) => {
        const result = await pool.query(
            "SELECT id, quantity FROM cart_items WHERE user_id = $1 AND product_id = $2",
            [user_id, product_id]
        );
        return result.rows[0] || null;
    },

    getMyCart: async (user_id) => {
        const result = await pool.query(
            `
            SELECT ci.id, ci.product_id, p.name, ci.quantity, ci.price, (ci.quantity * ci.price) AS total_price
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.user_id = $1
            `,
            [user_id]
        );
            
        return result.rows;
    },

    addCartItem: async (user_id, product_id, quantity, price) => {
        const result = await pool.query(
            `
            INSERT INTO cart_items (user_id, product_id, quantity, price)
            VALUES ($1, $2, $3, $4)
            RETURNING id
            `,
            [user_id, product_id, quantity, price]
        );
        return result.rows[0];
    },

    updateCartItemQuantity: async (cart_item_id, quantity) => {
        await pool.query(
            "UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
            [quantity, cart_item_id]
        );
    },

    updateCart: async (id, quantity) => {
        const cart = await pool.query("SELECT * FROM cart_items WHERE id = $1", [id]);
        const product = await pool.query("SELECT * FROM products WHERE id = $1", [cart.rows[0].product_id]);
        const price = quantity * product.rows[0].price;

        await pool.query(
            "UPDATE cart_items SET quantity = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $1",
            [id, quantity]
        );
    },

    deleteCart: async (id) => {
        await pool.query(`DELETE FROM cart_items WHERE id = $1`, [id]);
    },

    truncateCart: async (user_id) => {
        await pool.query(`DELETE FROM cart_items WHERE user_id = $1`, [user_id]);
    },
}

module.exports = Cart;