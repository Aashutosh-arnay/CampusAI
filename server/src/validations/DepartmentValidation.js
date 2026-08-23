const { body } = require("express-validator");

const createDepartmentValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Department name is required"),

    body("code")
        .trim()
        .notEmpty()
        .withMessage("Department code is required")
        .isLength({ min: 2 })
        .withMessage("Department code must be at least 2 characters"),

    body("description")
        .optional()
        .trim(),

    body("hod")
        .optional()
        .isMongoId()
        .withMessage("Invalid HOD ID")
];

module.exports = {
    createDepartmentValidation
};