const express = require("express");
const pool = require("../config/db");
const Cart = require("../models/Cart");
const { authenticate, authorizeAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Carts
 *   description: Cart management (add, update, delete, view)
 */

/**
 * @swagger
 * /api/carts/my-cart:
 *   get:
 *     summary: Get user's cart
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Carts retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       product_id:
 *                         type: integer
 *                         example: 2
 *                       name:
 *                         type: string
 *                         example: T-shirt
 *                       quantity:
 *                         type: integer
 *                         example: 3
 *                       price:
 *                         type: number
 *                         example: 150
 *                       total_price:
 *                         type: number
 *                         example: 450
 */
router.get("/my-cart", authenticate, async (req, res) => {
    try {
        const result = await Cart.getMyCart(req.user.id);
        res.json({
            success: true,
            message: "Carts retrieved successfully",
            data: result,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * @swagger
 * /api/carts:
 *   post:
 *     summary: Add product to cart
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: integer
 *                 example: 2
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Cart item added successfully
 *       400:
 *         description: Product ID and quantity are required
 *       404:
 *         description: Product not found
 */
router.post("/", authenticate, async (req, res) => {
    const user_id = req.user.id;
    const { product_id, quantity } = req.body;
    
    // Validasi input
    if (!product_id || !quantity) {
        return res.status(400).json({ success: false, message: "Product ID and quantity are required" });
    }

    try {
        // Ambil harga produk saat ini
        const price = await Cart.getCurrentPrice(product_id);
        if (!price) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Cek apakah produk sudah ada di keranjang
        const existingItem = await Cart.getCartItem(user_id, product_id);

        if (existingItem) {
            // Jika ada, perbarui jumlah
            const newQuantity = existingItem.quantity + quantity;
            await Cart.updateCartItemQuantity(existingItem.id, newQuantity);
            return res.json({ success: true, message: "Cart item updated successfully" });
        }

        // Jika tidak ada, tambahkan item baru
        const newCartItem = await Cart.addCartItem(user_id, product_id, quantity, price);

        res.status(201).json({
            success: true,
            message: "Cart added to cart",
            data: newCartItem,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * @swagger
 * /api/carts/{id}:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Cart item ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Cart updated successfully
 */
router.put("/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    try {
        const result = await Cart.updateCart(id, quantity);

        res.json({
            success: true,
            message: "Cart updated successfully",
            data: result,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * @swagger
 * /api/carts/{id}:
 *   delete:
 *     summary: Delete a cart item
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Cart item ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cart deleted successfully
 *       404:
 *         description: Cart item not found
 */
router.delete("/:id", authenticate, async (req, res) => {
    const { id } = req.params;

    try {
        await Cart.deleteCart(id);

        res.json({
            success: true,
            message: "Cart deleted successfully",
        });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
});

/**
 * @swagger
 * /api/carts/my/clear:
 *   delete:
 *     summary: Clear all items in the user's cart
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *       404:
 *         description: Error clearing the cart
 */
router.delete("/my/clear", authenticate, async (req, res) => {
    const user_id = req.user.id;

    try {
        await Cart.truncateCart(user_id);

        res.json({
            success: true,
            message: "Cart clear successfully",
        });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
});

module.exports = router;