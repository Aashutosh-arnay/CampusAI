const { mongoIdParam } = require("../validations/paramValidation");
const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const adminMiddleware = require("../middleware/adminMiddleware");
const validate = require("../middleware/validationMiddleware");

const {
    getAllStudents,
    getAllFaculty,
    deleteStudent,
    deleteFaculty
} = require("../controllers/adminController");

const {
    createDepartment,
    getAllDepartments
} = require("../controllers/departmentController");


/**
 * @swagger
 * /api/admin/test:
 *   get:
 *     summary: Test admin access
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin access granted
 *       401:
 *         description: Authentication failed
 *       403:
 *         description: Admin access required
 */
router.get(
    "/test",
    authMiddleware,
    adminMiddleware,
    (req, res) => {
        res.json({
            message: "Admin access granted"
        });
    }
);


/**
 * @swagger
 * /api/admin/students:
 *   get:
 *     summary: Get all students
 *     tags: [Admin]
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
 *         description: Number of students per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by student roll number
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort fields
 *     responses:
 *       200:
 *         description: Students fetched successfully
 *       401:
 *         description: Authentication failed
 *       403:
 *         description: Admin access required
 */
router.get(
    "/students",
    authMiddleware,
    adminMiddleware,
    getAllStudents
);


/**
 * @swagger
 * /api/admin/faculty:
 *   get:
 *     summary: Get all faculty
 *     tags: [Admin]
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
 *         description: Number of faculty members per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by employee ID
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort fields
 *     responses:
 *       200:
 *         description: Faculty fetched successfully
 *       401:
 *         description: Authentication failed
 *       403:
 *         description: Admin access required
 */
router.get(
    "/faculty",
    authMiddleware,
    adminMiddleware,
    getAllFaculty
);


/**
 * @swagger
 * /api/admin/students/{id}:
 *   delete:
 *     summary: Delete a student
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *       401:
 *         description: Authentication failed
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Student not found
 */
router.delete(
    "/students/:id",
    authMiddleware,
    adminMiddleware,
    mongoIdParam("id", "Student ID"),
    validate,
    deleteStudent
);


/**
 * @swagger
 * /api/admin/faculty/{id}:
 *   delete:
 *     summary: Delete a faculty member
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Faculty ID
 *     responses:
 *       200:
 *         description: Faculty deleted successfully
 *       401:
 *         description: Authentication failed
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Faculty not found
 */
router.delete(
    "/faculty/:id",
    authMiddleware,
    adminMiddleware,
    mongoIdParam("id", "Faculty ID"),
    validate,
    deleteFaculty
);


/**
 * @swagger
 * /api/admin/departments:
 *   post:
 *     summary: Create a department through the Admin API
 *     tags: [Admin]
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
 *         description: Department already exists or invalid request
 *       401:
 *         description: Authentication failed
 *       403:
 *         description: Admin access required
 */
router.post(
    "/departments",
    authMiddleware,
    adminMiddleware,
    createDepartment
);


/**
 * @swagger
 * /api/admin/departments:
 *   get:
 *     summary: Get all departments through the Admin API
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Departments fetched successfully
 *       401:
 *         description: Authentication failed
 *       403:
 *         description: Admin access required
 */
router.get(
    "/departments",
    authMiddleware,
    adminMiddleware,
    getAllDepartments
);


module.exports = router;