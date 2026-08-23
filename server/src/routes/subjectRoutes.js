const express = require("express");

const router = express.Router();

const validate = require("../middleware/validationMiddleware");

const {
    createSubjectValidation
} = require("../validations/subjectValidation");

const {
    createSubject,
    getAllSubjects,
    getSubjectById,
    updateSubject,
    deleteSubject
} = require("../controllers/subjectController");

const authMiddleware = require("../middleware/authMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");


/**
 * @swagger
 * /api/subjects:
 *   post:
 *     summary: Create a subject
 *     tags: [Subject]
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
 *               - course
 *               - semester
 *               - credits
 *             properties:
 *               name:
 *                 type: string
 *                 example: Data Structures
 *               code:
 *                 type: string
 *                 example: DS101
 *               course:
 *                 type: string
 *                 example: 60f7c0...
 *               semester:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 8
 *                 example: 3
 *               credits:
 *                 type: integer
 *                 minimum: 1
 *                 example: 4
 *               description:
 *                 type: string
 *                 example: Data Structures and Algorithms
 *     responses:
 *       201:
 *         description: Subject created successfully
 *       400:
 *         description: Validation error or subject already exists
 *       401:
 *         description: Authentication failed
 *       403:
 *         description: Admin access required
 */
router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    createSubjectValidation,
    validate,
    createSubject
);


/**
 * @swagger
 * /api/subjects:
 *   get:
 *     summary: Get all subjects
 *     tags: [Subject]
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
 *         description: Number of subjects per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by subject name or code
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort fields
 *     responses:
 *       200:
 *         description: Subjects fetched successfully
 *       401:
 *         description: Authentication failed
 */
router.get(
    "/",
    authMiddleware,
    getAllSubjects
);


/**
 * @swagger
 * /api/subjects/{id}:
 *   get:
 *     summary: Get subject by ID
 *     tags: [Subject]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Subject ID
 *     responses:
 *       200:
 *         description: Subject fetched successfully
 *       401:
 *         description: Authentication failed
 *       404:
 *         description: Subject not found
 */
router.get(
    "/:id",
    authMiddleware,
    getSubjectById
);


/**
 * @swagger
 * /api/subjects/{id}:
 *   put:
 *     summary: Update a subject
 *     tags: [Subject]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Subject ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Data Structures
 *               code:
 *                 type: string
 *                 example: DS101
 *               course:
 *                 type: string
 *                 example: 60f7c0...
 *               semester:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 8
 *                 example: 3
 *               credits:
 *                 type: integer
 *                 minimum: 1
 *                 example: 4
 *               description:
 *                 type: string
 *                 example: Updated subject description
 *     responses:
 *       200:
 *         description: Subject updated successfully
 *       400:
 *         description: Duplicate subject code or validation error
 *       401:
 *         description: Authentication failed
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Subject not found
 */
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    updateSubject
);


/**
 * @swagger
 * /api/subjects/{id}:
 *   delete:
 *     summary: Delete a subject
 *     tags: [Subject]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Subject ID
 *     responses:
 *       200:
 *         description: Subject deleted successfully
 *       401:
 *         description: Authentication failed
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Subject not found
 */
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    deleteSubject
);

module.exports = router;