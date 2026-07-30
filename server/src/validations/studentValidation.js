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

    body("semester")
        .isInt({ min: 1, max: 8 })
        .withMessage("Semester must be between 1 and 8"),

    body("section")
        .notEmpty()
        .withMessage("Section is required")

];

module.exports = {
    createStudentValidation
};