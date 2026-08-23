const { body } = require("express-validator");

const createStudentValidation = [

    body("rollNumber")
        .notEmpty()
        .withMessage("Roll number is required"),

    body("department")
        .notEmpty()
        .withMessage("Department is required"),

    body("course")
        .notEmpty()
        .withMessage("Course is required"),

    body("section")
        .notEmpty()
        .withMessage("Section is required"),

    body("semester")
        .isInt({ min: 1, max: 8 })
        .withMessage("Semester must be between 1 and 8")

];
const updateStudentValidation = [

    body("rollNumber")
        .optional()
        .notEmpty()
        .withMessage("Roll number cannot be empty"),

    body("department")
        .optional()
        .notEmpty()
        .withMessage("Department cannot be empty"),

    body("course")
        .optional()
        .notEmpty()
        .withMessage("Course cannot be empty"),

    body("section")
        .optional()
        .notEmpty()
        .withMessage("Section cannot be empty"),

    body("semester")
        .optional()
        .isInt({ min: 1, max: 8 })
        .withMessage("Semester must be between 1 and 8"),

    body("cgpa")
        .optional()
        .isFloat({ min: 0, max: 10 })
        .withMessage("CGPA must be between 0 and 10"),

    body("phone")
        .optional()
        .notEmpty()
        .withMessage("Phone cannot be empty"),

    body("skills")
        .optional()
        .isArray()
        .withMessage("Skills must be an array")

];

module.exports = {
    createStudentValidation,
    updateStudentValidation
};