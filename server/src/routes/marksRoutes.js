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

// Create Marks (Admin/Faculty)
router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin", "faculty"),
    createMarksValidation,
    validate,
    createMarks
);
// Get Student Marks
router.get(
    "/student/:studentId",
    authMiddleware,
    getStudentMarks
);
// Get Subject Marks
router.get(
    "/subject/:subjectId",
    authMiddleware,
    getSubjectMarks
);
// Update Marks
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("admin", "faculty"),
    updateMarks
);
// Delete Marks
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin", "faculty"),
    deleteMarks
);
// Get Marks Percentage
router.get(
    "/percentage/:studentId/:subjectId",
    authMiddleware,
    getMarksPercentage
);

module.exports = router;