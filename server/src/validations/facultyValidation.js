const { body } = require("express-validator");

const createFacultyValidation = [

    body("employeeId")
        .notEmpty()
        .withMessage("Employee ID is required"),

    body("department")
        .notEmpty()
        .withMessage("Department is required"),

    body("designation")
        .notEmpty()
        .withMessage("Designation is required")
];

const updateFacultyValidation = [

    body("employeeId")
        .optional()
        .notEmpty()
        .withMessage("Employee ID cannot be empty"),

    body("department")
        .optional()
        .notEmpty()
        .withMessage("Department cannot be empty"),

    body("designation")
        .optional()
        .notEmpty()
        .withMessage("Designation cannot be empty"),

    body("phone")
        .optional()
        .notEmpty()
        .withMessage("Phone cannot be empty")
];

module.exports = {
    createFacultyValidation,
    updateFacultyValidation
};