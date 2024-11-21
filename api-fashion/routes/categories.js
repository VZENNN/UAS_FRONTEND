const express = require("express");
const pool = require("../config/db");
const Category = require("../models/Category");
const { authenticate, authorizeAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management (CRUD)
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
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
 *                   example: Categories retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: Fashion
 *                       created_at:
 *                         type: string
 *                         example: "2024-11-19T00:00:00Z"
 *                       updated_at:
 *                         type: string
 *                         example: "2024-11-20T00:00:00Z"
 */
router.get("/", async (req, res) => {
    try {
        const result = await Category.getAll();
        res.json({
            success: true,
            message: "Categories retrieved successfully",
            data: result,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Create product (Admin only)
/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Fashion
 *     responses:
 *       201:
 *         description: Category created successfully
 *       500:
 *         description: Error creating category
 */
router.post("/", authenticate, authorizeAdmin, async (req, res) => {
    const { name } = req.body;

    try {
        const result = await Category.create(name);

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: result,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update product (Admin only)
/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update a category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The category ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Electronics
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 */
router.put("/:id", authenticate, authorizeAdmin, async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const result = await Category.update(id, name);
        if (!result) throw new Error("Category not found");

        res.json({
            success: true,
            message: "Category updated successfully",
            data: result,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete product (Admin only)
/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The category ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */
router.delete("/:id", authenticate, authorizeAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const cek = await Category.findById(id);
        if (!cek) throw new Error("Product not found");

        await Category.delete(id);

        res.json({
            success: true,
            message: "Category deleted successfully",
        });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
});

module.exports = router;