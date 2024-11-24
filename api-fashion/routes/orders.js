const express = require("express");
const pool = require("../config/db");
const { authenticate, authorizeAdmin } = require("../middleware/authMiddleware");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product");
const router = express.Router();

// Get all orders (Admin only)
/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management (CRUD) and checkout
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *       500:
 *         description: Error retrieving orders
 */
router.get("/", authenticate, authorizeAdmin, async (req, res) => {
    try {
        const orders = await Order.getAll();

        res.json({
            success: true,
            message: "Orders retrieved successfully",
            data: orders,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to retrieve orders",
        });
    }
});

// Get my orders (User only)
/**
 * @swagger
 * /api/orders/my-orders:
 *   get:
 *     summary: Get user orders (User only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's orders retrieved successfully
 *       404:
 *         description: No orders found for the user
 *       500:
 *         description: Error retrieving user's orders
 */
router.get("/my-orders", authenticate, async (req, res) => {
    try {
        const orders = await Order.getByUserId(req.user.id);
        if (!orders) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        res.json({
            success: true,
            message: "Your orders retrieved successfully",
            data: orders,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to retrieve your orders",
        });
    }
});

// Get order details
/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order details
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The order ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order details retrieved successfully
 *       404:
 *         description: Order not found
 *       403:
 *         description: Access denied
 *       500:
 *         description: Error retrieving order details
 */
router.get("/:id", authenticate, async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.getById(id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        // Authorization: Only admin or owner can view
        if (req.user.role === "user" && order.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }

        const items = await OrderItem.getByOrderId(id);
        order.items = items;

        res.json({
            success: true,
            message: "Order details retrieved successfully",
            data: order,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to retrieve order details",
        });
    }
});

// Checkout Product
/**
 * @swagger
 * /api/orders/checkout:
 *   post:
 *     summary: Checkout products and create an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: integer
 *                       example: 1
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       201:
 *         description: Checkout successful
 *       400:
 *         description: Insufficient stock or invalid items
 *       500:
 *         description: Checkout failed
 */
router.post("/checkout", authenticate, async (req, res) => {
    const { items } = req.body; // `items` is an array of { product_id, quantity }
    if (!items || items.length === 0) {
        return res.status(400).json({
            success: false,
            message: "No items provided for checkout",
        });
    }

    try {
        // Begin a transaction
        await pool.query("BEGIN");

        let totalPrice = 0;

        for (const item of items) {
            const product = await Product.findById(item.product_id);
            if (!product || product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for product ID ${item.product_id}`,
                });
            }

            totalPrice += product.price * item.quantity;

            // Decrease stock
            await Product.update(
                product.id,
                product.name,
                product.description,
                product.price,
                product.stock - item.quantity,
                product.image_url,
                product.category_id
            );
        }

        // Create order
        const order = await Order.create(req.user.id, totalPrice);

        // Create order items
        for (const item of items) {
            const product = await Product.findById(item.product_id);

            await OrderItem.create(order.id, item.product_id, item.quantity, product.price);
        }

        // Delete items from the cart
        await pool.query("DELETE FROM cart_items WHERE user_id = $1", [req.user.id]);

        // Commit the transaction
        await pool.query("COMMIT");

        res.status(201).json({
            success: true,
            message: "Checkout successful",
            data: { order, totalPrice },
        });
    } catch (error) {
        // Rollback the transaction on error
        await pool.query("ROLLBACK");

        res.status(500).json({
            success: false,
            message: error.message || "Checkout failed",
        });
    }
});

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Update order status (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The order ID
 *         schema:
 *           type: integer
 *       - name: status
 *         in: body
 *         required: true
 *         description: The new order status
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               enum: [Pending, Completed, Cancelled]
 *               example: Pending
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid status
 *       404:
 *         description: Order not found
 *       500:
 *         description: Error updating order status
 */
router.put("/:id/status", authenticate, authorizeAdmin, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Valid status values
    const validStatuses = ["Pending", "Completed", "Cancelled"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: `Invalid status. Valid statuses are: ${validStatuses.join(", ")}`,
        });
    }

    try {
        // Update the order status
        const updatedOrder = await Order.updateStatus(id, status);

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: updatedOrder,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to update order status",
        });
    }
});

module.exports = router;