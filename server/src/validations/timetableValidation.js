const { body } = require("express-validator");

const createTimetableValidation = [

    body("facultyAssignment")
        .notEmpty()
        .withMessage("Faculty Assignment ID is required")
        .isMongoId()
        .withMessage("Invalid Faculty Assignment ID"),

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
        .withMessage("Section is required"),

    body("day")
        .isIn([
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ])
        .withMessage("Invalid day"),

    body("startTime")
        .notEmpty()
        .withMessage("Start time is required"),

    body("endTime")
        .notEmpty()
        .withMessage("End time is required")

];

module.exports = {
    createTimetableValidation
};