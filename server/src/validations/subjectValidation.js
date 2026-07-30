const { body } = require("express-validator");

const createSubjectValidation = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Subject name is required"),

    body("code")
        .trim()
        .notEmpty()
        .withMessage("Subject code is required"),

    body("semester")
        .isInt({ min: 1, max: 8 })
        .withMessage("Semester must be between 1 and 8"),

    body("credits")
        .isInt({ min: 1 })
        .withMessage("Credits must be a positive number")

];

module.exports = {
    createSubjectValidation
};