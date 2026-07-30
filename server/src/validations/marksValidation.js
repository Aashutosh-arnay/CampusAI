const { body } = require("express-validator");

const createMarksValidation = [

    body("enrollment")
        .notEmpty()
        .withMessage("Enrollment ID is required")
        .isMongoId()
        .withMessage("Invalid Enrollment ID"),

    body("facultyAssignment")
        .notEmpty()
        .withMessage("Faculty Assignment ID is required")
        .isMongoId()
        .withMessage("Invalid Faculty Assignment ID"),

    body("marksObtained")
        .isFloat({ min: 0 })
        .withMessage("Marks Obtained must be a positive number"),

    body("maxMarks")
        .isFloat({ min: 1 })
        .withMessage("Maximum Marks must be greater than 0"),

    body("examType")
        .notEmpty()
        .withMessage("Exam Type is required")

];

module.exports = {
    createMarksValidation
};