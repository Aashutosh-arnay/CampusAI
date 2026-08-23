const express = require("express");

const router = express.Router();

const validate = require("../middleware/validationMiddleware");

const {
    markAttendanceValidation
} = require("../validations/attendanceValidation");

const {
    markAttendance,
    getStudentAttendance,
    getSubjectAttendance,
    updateAttendance,
    deleteAttendance,
    getAttendancePercentage,
    getAllAttendance
} = require("../controllers/attendanceController");

const authMiddleware = require("../middleware/authMiddleware");


/**
 * @swagger
 * /api/attendance:
 *   get:
 *     summary: Get all attendance records
 *     tags: [Attendance]
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
 *         description: Number of records per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort fields
 *     responses:
 *       200:
 *         description: Attendance records fetched successfully
 *       401:
 *         description: Authentication failed
 */
router.get(
    "/",
    authMiddleware,
    getAllAttendance
);


/**
 * @swagger
 * /api/attendance/student/{studentId}:
 *   get:
 *     summary: Get attendance of a student
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Attendance fetched successfully
 *       401:
 *         description: Authentication failed
 */
router.get(
    "/student/:studentId",
    authMiddleware,
    getStudentAttendance
);


/**
 * @swagger
 * /api/attendance/subject/{subjectId}:
 *   get:
 *     summary: Get attendance for a subject
 *     tags: [Attendance]
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
 *         description: Subject attendance fetched successfully
 *       401:
 *         description: Authentication failed
 */
router.get(
    "/subject/:subjectId",
    authMiddleware,
    getSubjectAttendance
);


/**
 * @swagger
 * /api/attendance/percentage/{studentId}/{subjectId}:
 *   get:
 *     summary: Get attendance percentage of a student for a subject
 *     tags: [Attendance]
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
 *         description: Attendance percentage calculated successfully
 *       401:
 *         description: Authentication failed
 *       404:
 *         description: Enrollment not found
 */
router.get(
    "/percentage/:studentId/:subjectId",
    authMiddleware,
    getAttendancePercentage
);


/**
 * @swagger
 * /api/attendance:
 *   post:
 *     summary: Mark attendance
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - enrollment
 *               - facultyAssignment
 *               - date
 *             properties:
 *               enrollment:
 *                 type: string
 *                 example: 60f7c0...
 *               facultyAssignment:
 *                 type: string
 *                 example: 60f7c1...
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-08-20T09:00:00.000Z
 *               status:
 *                 type: string
 *                 enum:
 *                   - Present
 *                   - Absent
 *                   - Late
 *                 example: Present
 *               remarks:
 *                 type: string
 *                 example: Regular class
 *     responses:
 *       201:
 *         description: Attendance marked successfully
 *       400:
 *         description: Validation error or attendance already marked
 *       401:
 *         description: Authentication failed
 *       404:
 *         description: Enrollment or faculty assignment not found
 */
router.post(
    "/",
    authMiddleware,
    markAttendanceValidation,
    validate,
    markAttendance
);


/**
 * @swagger
 * /api/attendance/{id}:
 *   put:
 *     summary: Update an attendance record
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Attendance record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-08-20T09:00:00.000Z
 *               status:
 *                 type: string
 *                 enum:
 *                   - Present
 *                   - Absent
 *                   - Late
 *                 example: Present
 *               remarks:
 *                 type: string
 *                 example: Updated attendance remark
 *     responses:
 *       200:
 *         description: Attendance updated successfully
 *       401:
 *         description: Authentication failed
 *       404:
 *         description: Attendance not found
 */
router.put(
    "/:id",
    authMiddleware,
    updateAttendance
);


/**
 * @swagger
 * /api/attendance/{id}:
 *   delete:
 *     summary: Delete an attendance record
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Attendance record ID
 *     responses:
 *       200:
 *         description: Attendance deleted successfully
 *       401:
 *         description: Authentication failed
 *       404:
 *         description: Attendance not found
 */
router.delete(
    "/:id",
    authMiddleware,
    deleteAttendance
);


module.exports = router;