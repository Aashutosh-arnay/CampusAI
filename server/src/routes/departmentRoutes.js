const express = require("express");
const router = express.Router();
const validate = require("../middleware/validationMiddleware");

const {
    createDepartmentValidation
} = require("../validations/departmentValidation");

const {
    createDepartment,
    getAllDepartments
} = require("../controllers/departmentController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Create Department
/**
 * @swagger
 * /api/departments:
 *   post:
 *     summary: Create a department
 *     tags: [Department]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - code
 *             properties:
 *               name:
 *                 type: string
 *                 example: Computer Science Engineering
 *               code:
 *                 type: string
 *                 example: CSE
 *               description:
 *                 type: string
 *                 example: Computer Science Engineering Department
 *               hod:
 *                 type: string
 *                 example: 60f7c0...
 *     responses:
 *       201:
 *         description: Department created successfully
 *       400:
 *         description: Validation error or department already exists
 *       401:
 *         description: Authentication failed
 *       403:
 *         description: Admin access required
 */
router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    createDepartmentValidation,
    validate,
    createDepartment
);

// Get All Departments
/**
 * @swagger
 * /api/departments:
 *   get:
 *     summary: Get all departments
 *     tags: [Department]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of departments per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by department name or code
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort fields
 *     responses:
 *       200:
 *         description: Departments fetched successfully
 *       401:
 *         description: Authentication failed
 */

router.get(
    "/",
    authMiddleware,
    getAllDepartments
);

module.exports = router;