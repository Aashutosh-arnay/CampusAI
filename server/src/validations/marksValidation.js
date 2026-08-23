const { body } = require("express-validator");

const createMarksValidation = [

    body("student")
        .notEmpty()
        .withMessage("Student ID is required")
        .isMongoId()
        .withMessage("Invalid Student ID"),

    body("subject")
        .notEmpty()
        .withMessage("Subject ID is required")
        .isMongoId()
        .withMessage("Invalid Subject ID"),

    body("facultyAssignment")
        .notEmpty()
        .withMessage("Faculty Assignment ID is required")
        .isMongoId()
        .withMessage("Invalid Faculty Assignment ID"),

    body("marksObtained")
        .isFloat({ min: 0 })
        .withMessage("Marks Obtained must be a positive number"),

    body("totalMarks")
        .isFloat({ min: 1 })
        .withMessage("Total Marks must be greater than 0"),

    body("examType")
        .notEmpty()
        .withMessage("Exam Type is required")
        .isIn([
            "Quiz",
            "Midterm",
            "End Semester",
            "Assignment",
            "Lab"
        ])
        .withMessage(
            "Exam Type must be Quiz, Midterm, End Semester, Assignment, or Lab"
        ),

    body("remarks")
        .optional()
        .trim()

];

module.exports = {
    createMarksValidation
};