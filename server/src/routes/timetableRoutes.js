const express = require("express");

const router = express.Router();
const validate = require("../middleware/validationMiddleware");

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

// Create Timetable (Admin Only)
router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    createTimetableValidation,
    validate,
    createTimetable
);
// Get Timetable by Section
router.get(
    "/section/:academicYear/:semester/:section",
    authMiddleware,
    getSectionTimetable
);
// Get Faculty Timetable
router.get(
    "/faculty/:facultyAssignmentId",
    authMiddleware,
    getFacultyTimetable
);
// Update Timetable
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    updateTimetable
);
// Delete Timetable
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    deleteTimetable
);

module.exports = router;