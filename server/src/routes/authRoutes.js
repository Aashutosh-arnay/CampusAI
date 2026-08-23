const express = require("express");
const router = express.Router();

const validate = require("../middleware/validationMiddleware");
const loginRateLimiter = require("../middleware/loginRateLimiter");

const {
    registerValidation,
    loginValidation
} = require("../validations/authValidation");

const { 
    registerUser, 
    loginUser 
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ashutosh
 *               email:
 *                 type: string
 *                 example: student@gmail.com
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 example: student
 *               rollNumber:
 *                 type: string
 *                 example: CSE101
 *               semester:
 *                 type: number
 *                 example: 5
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists
 */

// Register API
router.post(
    "/register",
    registerValidation,
    validate,
    registerUser
);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: student@gmail.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */

// Login API
router.post(
    "/login",
    loginRateLimiter,
    loginValidation,
    validate,
    loginUser
);


module.exports = router;