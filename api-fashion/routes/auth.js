const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication (login, register, logout)
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: strongpassword
 *               role:
 *                 type: string
 *                 example: user
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Email already exists
 *       500:
 *         description: Internal server error
 */
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists",
            });
        }

        let userRole = role || 'user';

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create(name, email, hashedPassword, userRole);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: { id: user.id, name: user.name, email: user.email },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to register user",
        });
    }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user and return JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: strongpassword
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: jwt_token_example
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new Error("Invalid credentials");

        const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

        res.json({
            success: true,
            message: "Login successful",
            data: { token },
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message || "Login failed",
        });
    }
});

/**
 * @swagger
 * /api/auth/logout:
 *   get:
 *     summary: Logout the user and clear JWT cookie
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully logged out
 */
router.get("/logout", async (req, res) => {
    res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    // Send response
    res.json({
        success: true,
        message: "Logged out successfully",
    });
});

module.exports = router;