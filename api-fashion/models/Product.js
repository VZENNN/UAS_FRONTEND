const pool = require("../config/db");

const Product = {
    getAll: async () => {
        const result = await pool.query(`SELECT p.*, c.name as category FROM products AS p LEFT JOIN categories AS c ON c.id = p.category_id ORDER BY p.name ASC`);
        return result.rows;
    },

    filter: async (minPrice, maxPrice, categoryId, name) => {
        let query = `SELECT p.*, c.name as category FROM products AS p LEFT JOIN categories AS c ON c.id = p.category_id WHERE 1=1`;
        const values = [];

        if (minPrice !== undefined) {
            query += ` AND p.price >= $${values.length + 1}`;
            values.push(minPrice);
        }

        if (maxPrice !== undefined) {
            query += ` AND p.price <= $${values.length + 1}`;
            values.push(maxPrice);
        }

        if (categoryId !== undefined) {
            query += ` AND p.category_id = $${values.length + 1}`;
            values.push(categoryId);
        }

        if (name !== undefined) {
            query += ` AND p.name ilike $${values.length + 1}`;
            values.push(`%${name}%`);
        }

        query += ` ORDER BY p.name ASC`;

        const result = await pool.query(query, values);
        return result.rows;
    },

    create: async (name, description, price, stock, image_url, category_id) => {
        const result = await pool.query(
            `INSERT INTO products (name, description, price, stock, image_url, category_id)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [name, description, price, stock, image_url, category_id]
        );
        return result.rows[0];
    },

    update: async (id, name, description, price, stock, image_url, category_id) => {
        const result = await pool.query(
            `UPDATE products SET name = $1, description = $2, price = $3, stock = $4, image_url = $5, category_id = $6, updated_at = CURRENT_TIMESTAMP
             WHERE id = $7 RETURNING *`,
            [name, description, price, stock, image_url, category_id, id]
        );
        return result.rows[0];
    },

    delete: async (id) => {
        await pool.query(`DELETE FROM products WHERE id = $1`, [id]);
    },

    findById: async (id) => {
        const result = await pool.query(`SELECT p.*, c.name as category FROM products AS p LEFT JOIN categories AS c ON c.id = p.category_id WHERE p.id = $1`, [id]);
        return result.rows[0];
    },
};

module.exports = Product;