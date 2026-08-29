const { mongoIdParam } = require("../validations/paramValidation");
const express = require("express");

const router = express.Router();

const validate = require("../middleware/validationMiddleware");

const {
    createEnrollmentValidation
} = require("../validations/enrollmentValidation");

const {
    createEnrollment,
    getStudentEnrollments,
    getSubjectStudents,
    deleteEnrollment
} = require("../controllers/enrollmentController");

const authMiddleware = require("../middleware/authMiddleware");


/**
 * @swagger
 * /api/enrollments:
 *   post:
 *     summary: Enroll a student in a subject
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - student
 *               - subject
 *               - academicYear
 *               - semester
 *               - section
 *             properties:
 *               student:
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
 *                 minimum: 1
 *                 maximum: 8
 *                 example: 3
 *               section:
 *                 type: string
 *                 example: A
 *     responses:
 *       201:
 *         description: Student enrolled successfully
 *       400:
 *         description: Validation error or student already enrolled
 *       401:
 *         description: Authentication failed
 *       404:
 *         description: Student or subject not found
 */
router.post(
    "/",
    authMiddleware,
    createEnrollmentValidation,
    validate,
    createEnrollment
);


/**
 * @swagger
 * /api/enrollments/student/{studentId}:
 *   get:
 *     summary: Get all enrollments of a student
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
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
 *         description: Number of enrollments per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort fields
 *     responses:
 *       200:
 *         description: Enrollments fetched successfully
 *       401:
 *         description: Authentication failed
 *       404:
 *         description: Student not found
 */
router.get(
    "/student/:studentId",
    authMiddleware,
    mongoIdParam("studentId", "Student ID"),
    validate,
    getStudentEnrollments
);


/**
 * @swagger
 * /api/enrollments/subject/{subjectId}:
 *   get:
 *     summary: Get students enrolled in a subject
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subjectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Subject ID
 *     responses:
 *       200:
 *         description: Subject students fetched successfully
 *       401:
 *         description: Authentication failed
 *       404:
 *         description: Subject not found
 */
router.get(
    "/subject/:subjectId",
    authMiddleware,
    mongoIdParam("subjectId", "Subject ID"),
    validate,
    getSubjectStudents
);

/**
 * @swagger
 * /api/enrollments/{id}:
 *   delete:
 *     summary: Delete an enrollment
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Enrollment ID
 *     responses:
 *       200:
 *         description: Enrollment deleted successfully
 *       401:
 *         description: Authentication failed
 *       404:
 *         description: Enrollment not found
 */
router.delete(
    "/:id",
    authMiddleware,
    mongoIdParam("id", "Enrollment ID"),
    validate,
    deleteEnrollment
);


module.exports = router;