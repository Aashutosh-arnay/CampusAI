const express = require("express");

const router = express.Router();

const validate = require("../middleware/validationMiddleware");

const {
    createFacultyAssignmentValidation,
    updateFacultyAssignmentValidation
} = require("../validations/facultyAssignmentValidation");

const {
    assignFaculty,
    getAllAssignments,
    getAssignmentById,
    updateAssignment,
    deleteAssignment
} = require("../controllers/facultyAssignmentController");

const authMiddleware = require("../middleware/authMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");


/**
 * @swagger
 * /api/faculty-assignments:
 *   post:
 *     summary: Assign faculty to a subject
 *     tags: [Faculty Assignment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - faculty
 *               - subject
 *               - academicYear
 *               - semester
 *               - section
 *             properties:
 *               faculty:
 *                 type: string
 *                 example: 60f7c0...
 *               subject:
 *                 type: string
 *                 example: 60f7c1...
 *               academicYear:
 *                 type: string
 *                 example: 2026-27
 *               semester:
 *                 type: integer
 *                 example: 3
 *               section:
 *                 type: string
 *                 example: A
 *     responses:
 *       201:
 *         description: Faculty assigned successfully
 *       400:
 *         description: Validation error or duplicate assignment
 *       401:
 *         description: Authentication failed
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Faculty or subject not found
 */
router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    createFacultyAssignmentValidation,
    validate,
    assignFaculty
);


/**
 * @swagger
 * /api/faculty-assignments:
 *   get:
 *     summary: Get all faculty assignments
 *     tags: [Faculty Assignment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Faculty assignments fetched successfully
 *       401:
 *         description: Authentication failed
 */
router.get(
    "/",
    authMiddleware,
    getAllAssignments
);


/**
 * @swagger
 * /api/faculty-assignments/{id}:
 *   get:
 *     summary: Get faculty assignment by ID
 *     tags: [Faculty Assignment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Faculty assignment ID
 *     responses:
 *       200:
 *         description: Faculty assignment fetched successfully
 *       401:
 *         description: Authentication failed
 *       404:
 *         description: Faculty assignment not found
 */
router.get(
    "/:id",
    authMiddleware,
    getAssignmentById
);


/**
 * @swagger
 * /api/faculty-assignments/{id}:
 *   put:
 *     summary: Update a faculty assignment
 *     tags: [Faculty Assignment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Faculty assignment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               faculty:
 *                 type: string
 *                 example: 60f7c0...
 *               subject:
 *                 type: string
 *                 example: 60f7c1...
 *               academicYear:
 *                 type: string
 *                 example: 2026-27
 *               semester:
 *                 type: integer
 *                 example: 3
 *               section:
 *                 type: string
 *                 example: A
 *     responses:
 *       200:
 *         description: Faculty assignment updated successfully
 *       400:
 *         description: Validation error or duplicate assignment
 *       401:
 *         description: Authentication failed
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Faculty assignment not found
 */
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    updateFacultyAssignmentValidation,
    validate,
    updateAssignment
);


/**
 * @swagger
 * /api/faculty-assignments/{id}:
 *   delete:
 *     summary: Delete a faculty assignment
 *     tags: [Faculty Assignment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Faculty assignment ID
 *     responses:
 *       200:
 *         description: Faculty assignment deleted successfully
 *       401:
 *         description: Authentication failed
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Faculty assignment not found
 */
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    deleteAssignment
);

module.exports = router;