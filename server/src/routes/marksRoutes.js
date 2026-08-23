const express = require("express");

const router = express.Router();

const validate = require("../middleware/validationMiddleware");

const {
    createMarksValidation
} = require("../validations/marksValidation");

const {
    createMarks,
    getStudentMarks,
    getSubjectMarks,
    updateMarks,
    deleteMarks,
    getMarksPercentage
} = require("../controllers/marksController");

const authMiddleware = require("../middleware/authMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");


/**
 * @swagger
 * /api/marks:
 *   post:
 *     summary: Create a marks record
 *     tags: [Marks]
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
 *               - facultyAssignment
 *               - examType
 *               - marksObtained
 *               - totalMarks
 *             properties:
 *               student:
 *                 type: string
 *                 example: 60f7c0...
 *               subject:
 *                 type: string
 *                 example: 60f7c1...
 *               facultyAssignment:
 *                 type: string
 *                 example: 60f7c2...
 *               examType:
 *                 type: string
 *                 enum:
 *                   - Quiz
 *                   - Midterm
 *                   - End Semester
 *                   - Assignment
 *                   - Lab
 *                 example: Midterm
 *               marksObtained:
 *                 type: number
 *                 minimum: 0
 *                 example: 42
 *               totalMarks:
 *                 type: number
 *                 minimum: 1
 *                 example: 50
 *               remarks:
 *                 type: string
 *                 example: Good performance
 *     responses:
 *       201:
 *         description: Marks added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication failed
 *       403:
 *         description: Admin or faculty access required
 *       404:
 *         description: Student, subject, or faculty assignment not found
 */
router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin", "faculty"),
    createMarksValidation,
    validate,
    createMarks
);


/**
 * @swagger
 * /api/marks/student/{studentId}:
 *   get:
 *     summary: Get marks of a student
 *     tags: [Marks]
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
 *         description: Number of marks records per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort fields
 *     responses:
 *       200:
 *         description: Student marks fetched successfully
 *       401:
 *         description: Authentication failed
 */
router.get(
    "/student/:studentId",
    authMiddleware,
    getStudentMarks
);


/**
 * @swagger
 * /api/marks/subject/{subjectId}:
 *   get:
 *     summary: Get marks for a subject
 *     tags: [Marks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subjectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Subject ID
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
 *         description: Number of marks records per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort fields
 *     responses:
 *       200:
 *         description: Subject marks fetched successfully
 *       401:
 *         description: Authentication failed
 *       404:
 *         description: Subject not found
 */
router.get(
    "/subject/:subjectId",
    authMiddleware,
    getSubjectMarks
);


/**
 * @swagger
 * /api/marks/percentage/{studentId}/{subjectId}:
 *   get:
 *     summary: Get marks percentage of a student for a subject
 *     tags: [Marks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *       - in: path
 *         name: subjectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Subject ID
 *     responses:
 *       200:
 *         description: Marks percentage calculated successfully
 *       401:
 *         description: Authentication failed
 *       404:
 *         description: Student, subject, or marks not found
 */
router.get(
    "/percentage/:studentId/:subjectId",
    authMiddleware,
    getMarksPercentage
);


/**
 * @swagger
 * /api/marks/{id}:
 *   put:
 *     summary: Update a marks record
 *     tags: [Marks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Marks record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               marksObtained:
 *                 type: number
 *                 minimum: 0
 *                 example: 45
 *               totalMarks:
 *                 type: number
 *                 minimum: 1
 *                 example: 50
 *               examType:
 *                 type: string
 *                 enum:
 *                   - Quiz
 *                   - Midterm
 *                   - End Semester
 *                   - Assignment
 *                   - Lab
 *                 example: Midterm
 *               remarks:
 *                 type: string
 *                 example: Updated after re-evaluation
 *     responses:
 *       200:
 *         description: Marks updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication failed
 *       403:
 *         description: Admin or faculty access required
 *       404:
 *         description: Marks record not found
 */
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("admin", "faculty"),
    updateMarks
);


/**
 * @swagger
 * /api/marks/{id}:
 *   delete:
 *     summary: Delete a marks record
 *     tags: [Marks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Marks record ID
 *     responses:
 *       200:
 *         description: Marks deleted successfully
 *       401:
 *         description: Authentication failed
 *       403:
 *         description: Admin or faculty access required
 *       404:
 *         description: Marks record not found
 */
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin", "faculty"),
    deleteMarks
);


module.exports = router;