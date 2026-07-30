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


// Get All Attendance
router.get(
    "/",
    authMiddleware,
    getAllAttendance
);


// Get Student Attendance
router.get(
    "/student/:studentId",
    authMiddleware,
    getStudentAttendance
);


// Get Subject Attendance
router.get(
    "/subject/:subjectId",
    authMiddleware,
    getSubjectAttendance
);


// Attendance Percentage
router.get(
    "/percentage/:studentId/:subjectId",
    authMiddleware,
    getAttendancePercentage
);


// Mark Attendance
router.post(
    "/",
    authMiddleware,
    markAttendanceValidation,
    validate,
    markAttendance
);


// Update Attendance
router.put(
    "/:id",
    authMiddleware,
    updateAttendance
);


// Delete Attendance
router.delete(
    "/:id",
    authMiddleware,
    deleteAttendance
);


module.exports = router;