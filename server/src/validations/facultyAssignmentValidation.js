const { body } = require("express-validator");

const createFacultyAssignmentValidation = [

    body("faculty")
        .notEmpty()
        .withMessage("Faculty is required"),

    body("subject")
        .notEmpty()
        .withMessage("Subject is required"),

    body("academicYear")
        .notEmpty()
        .withMessage("Academic year is required"),

    body("semester")
        .isInt({ min: 1, max: 8 })
        .withMessage("Semester must be between 1 and 8"),

    body("section")
        .notEmpty()
        .withMessage("Section is required")
];

const updateFacultyAssignmentValidation = [

    body("faculty")
        .optional()
        .notEmpty()
        .withMessage("Faculty cannot be empty"),

    body("subject")
        .optional()
        .notEmpty()
        .withMessage("Subject cannot be empty"),

    body("academicYear")
        .optional()
        .notEmpty()
        .withMessage("Academic year cannot be empty"),

    body("semester")
        .optional()
        .isInt({ min: 1, max: 8 })
        .withMessage("Semester must be between 1 and 8"),

    body("section")
        .optional()
        .notEmpty()
        .withMessage("Section cannot be empty")
];

module.exports = {
    createFacultyAssignmentValidation,
    updateFacultyAssignmentValidation
};