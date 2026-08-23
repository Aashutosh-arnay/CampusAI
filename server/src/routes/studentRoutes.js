const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const validate = require("../middleware/validationMiddleware");

const {
    createStudentValidation,
    updateStudentValidation
} = require("../validations/studentValidation");

const {
    createStudentProfile,
    getStudentProfile,
    updateStudentProfile,
    deleteStudentProfile
} = require("../controllers/studentController");

/**
 * @swagger
 * /api/student/profile:
 *   post:
 *     summary: Create student profile
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rollNumber
 *               - department
 *               - semester
 *             properties:
 *               rollNumber:
 *                 type: string
 *                 example: CSE2026001
 *               department:
 *                 type: string
 *                 example: Computer Science
 *               semester:
 *                 type: number
 *                 example: 5
 *     responses:
 *       201:
 *         description: Student profile created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
// Create student profile
router.post(
    "/profile",
    authMiddleware,
    roleMiddleware("student"),
    createStudentValidation,
    validate,
    createStudentProfile
);
/**
 * @swagger
 * /api/student/profile:
 *   get:
 *     summary: Get logged-in student profile
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Student profile fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Student profile not found
 */

// Get student profile
router.get(
    "/profile",
    authMiddleware,
    roleMiddleware("student"),
    getStudentProfile
);

/**
 * @swagger
 * /api/student/profile:
 *   put:
 *     summary: Update logged-in student profile
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rollNumber:
 *                 type: string
 *               department:
 *                 type: string
 *               semester:
 *                 type: integer
 *               phone:
 *                 type: string
 *               cgpa:
 *                 type: number
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Student profile updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Student profile not found
 */

router.put(
    "/profile",
    authMiddleware,
    roleMiddleware("student"),
    updateStudentValidation,
    validate,
    updateStudentProfile
);

/**
 * @swagger
 * /api/student/profile:
 *   delete:
 *     summary: Delete logged-in student profile
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Student profile deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Student profile not found
 */
// Delete student profile
router.delete(
    "/profile",
    authMiddleware,
    roleMiddleware("student"),
    deleteStudentProfile
);


module.exports = router;