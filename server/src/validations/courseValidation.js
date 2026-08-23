const { body } = require("express-validator");

const createCourseValidation = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Course name is required"),

    body("code")
        .trim()
        .notEmpty()
        .withMessage("Course code is required"),

    body("department")
        .notEmpty()
        .withMessage("Department is required")
        .isMongoId()
        .withMessage("Invalid department ID"),

    body("duration")
        .isInt({ min: 1 })
        .withMessage("Duration must be a positive number")

];

module.exports = {
    createCourseValidation
};