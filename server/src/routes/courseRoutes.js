const express = require("express");

const router = express.Router();

const validate = require("../middleware/validationMiddleware");

const {
    createCourseValidation
} = require("../validations/courseValidation");

const {
    mongoIdParam
} = require("../validations/paramValidation");

const {
    createCourse,
    getAllCourse,
    getCourseById,
    updateCourse,
    deleteCourse
} = require("../controllers/courseController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");


/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Create a course
 *     tags: [Course]
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
 *               - department
 *               - duration
 *             properties:
 *               name:
 *                 type: string
 *                 example: Bachelor of Technology
 *               code:
 *                 type: string
 *                 example: BTECH
 *               department:
 *                 type: string
 *                 example: 60f7c0...
 *               duration:
 *                 type: integer
 *                 minimum: 1
 *                 example: 4
 *               description:
 *                 type: string
 *                 example: Bachelor of Technology program
 *     responses:
 *       201:
 *         description: Course created successfully
 *       400:
 *         description: Validation error or course already exists
 *       401:
 *         description: Authentication failed
 *       403:
 *         description: Admin access required
 */
router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    createCourseValidation,
    validate,
    createCourse
);


/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Course]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Courses fetched successfully
 *       401:
 *         description: Authentication failed
 */
router.get(
    "/",
    authMiddleware,
    getAllCourse
);


/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Get course by ID
 *     tags: [Course]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course fetched successfully
 *       400:
 *         description: Invalid Course ID
 *       401:
 *         description: Authentication failed
 *       404:
 *         description: Course not found
 */
router.get(
    "/:id",
    authMiddleware,
    mongoIdParam("id", "Course ID"),
    validate,
    getCourseById
);


/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     summary: Update a course
 *     tags: [Course]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Bachelor of Technology
 *               code:
 *                 type: string
 *                 example: BTECH
 *               department:
 *                 type: string
 *                 example: 60f7c0...
 *               duration:
 *                 type: integer
 *                 minimum: 1
 *                 example: 4
 *               description:
 *                 type: string
 *                 example: Updated course description
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       400:
 *         description: Duplicate course code or validation error
 *       401:
 *         description: Authentication failed
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Course not found
 */
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    updateCourse
);


/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Course]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       400:
 *         description: Invalid Course ID
 *       401:
 *         description: Authentication failed
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Course not found
 */
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    deleteCourse
);

module.exports = router;