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


// Create Enrollment
router.post(
    "/",
    authMiddleware,
    createEnrollmentValidation,
    validate,
    createEnrollment
);
// Get Student Enrollments
router.get(
    "/student/:studentId",
    authMiddleware,
    getStudentEnrollments
);
// Get Students Enrolled in a Subject
router.get(
    "/subject/:subjectId",
    authMiddleware,
    getSubjectStudents
);
// Delete Enrollment
router.delete(
    "/:id",
    authMiddleware,
    deleteEnrollment
);


module.exports = router;