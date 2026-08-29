const express = require("express");

const router = express.Router();

const validate = require("../middleware/validationMiddleware");
const { mongoIdParam } = require("../validations/paramValidation");

const {
    createTimetableValidation
} = require("../validations/timetableValidation");

const {
    createTimetable,
    getSectionTimetable,
    getFacultyTimetable,
    updateTimetable,
    deleteTimetable
} = require("../controllers/timetableController");

const authMiddleware = require("../middleware/authMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");


/**
 * @swagger
 * /api/timetables:
 *   post:
 *     summary: Create a timetable entry
 *     tags: [Timetable]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject
 *               - facultyAssignment
 *               - day
 *               - startTime
 *               - endTime
 *               - roomNumber
 *               - academicYear
 *               - semester
 *               - section
 *             properties:
 *               subject:
 *                 type: string
 *                 example: 60f7c0...
 *               facultyAssignment:
 *                 type: string
 *                 example: 60f7c1...
 *               day:
 *                 type: string
 *                 enum:
 *                   - Monday
 *                   - Tuesday
 *                   - Wednesday
 *                   - Thursday
 *                   - Friday
 *                   - Saturday
 *                 example: Monday
 *               startTime:
 *                 type: string
 *                 example: "10:00"
 *               endTime:
 *                 type: string
 *                 example: "11:00"
 *               roomNumber:
 *                 type: string
 *                 example: R-101
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
 *         description: Timetable created successfully
 *       400:
 *         description: Validation error, faculty clash, or room clash
 *       401:
 *         description: Authentication failed
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Subject or faculty assignment not found
 */
router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    createTimetableValidation,
    validate,
    createTimetable
);


/**
 * @swagger
 * /api/timetables/section/{academicYear}/{semester}/{section}:
 *   get:
 *     summary: Get timetable for a section
 *     tags: [Timetable]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: academicYear
 *         required: true
 *         schema:
 *           type: string
 *         example: 2026-27
 *       - in: path
 *         name: semester
 *         required: true
 *         schema:
 *           type: integer
 *         example: 3
 *       - in: path
 *         name: section
 *         required: true
 *         schema:
 *           type: string
 *         example: A
 *     responses:
 *       200:
 *         description: Section timetable fetched successfully
 *       401:
 *         description: Authentication failed
 */
router.get(
    "/section/:academicYear/:semester/:section",
    authMiddleware,
    getSectionTimetable
);


/**
 * @swagger
 * /api/timetables/faculty/{facultyAssignmentId}:
 *   get:
 *     summary: Get timetable for a faculty assignment
 *     tags: [Timetable]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: facultyAssignmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Faculty assignment ID
 *     responses:
 *       200:
 *         description: Faculty timetable fetched successfully
 *       401:
 *         description: Authentication failed
 *       404:
 *         description: Faculty assignment not found
 */
router.get(
    "/faculty/:facultyAssignmentId",
    authMiddleware,
    mongoIdParam("facultyAssignmentId", "Faculty Assignment ID"),
    validate,
    getFacultyTimetable
);


/**
 * @swagger
 * /api/timetables/{id}:
 *   put:
 *     summary: Update a timetable entry
 *     tags: [Timetable]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Timetable ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *                 example: 60f7c0...
 *               facultyAssignment:
 *                 type: string
 *                 example: 60f7c1...
 *               day:
 *                 type: string
 *                 enum:
 *                   - Monday
 *                   - Tuesday
 *                   - Wednesday
 *                   - Thursday
 *                   - Friday
 *                   - Saturday
 *                 example: Tuesday
 *               startTime:
 *                 type: string
 *                 example: "11:00"
 *               endTime:
 *                 type: string
 *                 example: "12:00"
 *               roomNumber:
 *                 type: string
 *                 example: R-102
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
 *       200:
 *         description: Timetable updated successfully
 *       401:
 *         description: Authentication failed
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Timetable not found
 */
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    mongoIdParam("id", "Timetable ID"),
    validate,
    updateTimetable
);

/**
 * @swagger
 * /api/timetables/{id}:
 *   delete:
 *     summary: Delete a timetable entry
 *     tags: [Timetable]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Timetable ID
 *     responses:
 *       200:
 *         description: Timetable deleted successfully
 *       401:
 *         description: Authentication failed
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Timetable not found
 */
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    mongoIdParam("id", "Timetable ID"),
    validate,
    deleteTimetable
);

module.exports = router;