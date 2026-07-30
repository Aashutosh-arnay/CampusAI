const { body } = require("express-validator");

const createEnrollmentValidation = [

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

    body("academicYear")
        .trim()
        .notEmpty()
        .withMessage("Academic Year is required"),

    body("semester")
        .isInt({ min: 1, max: 8 })
        .withMessage("Semester must be between 1 and 8"),

    body("section")
        .trim()
        .notEmpty()
        .withMessage("Section is required")

];

module.exports = {
    createEnrollmentValidation
};