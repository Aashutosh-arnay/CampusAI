const { body } = require("express-validator");

const markAttendanceValidation = [

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

    body("date")
        .notEmpty()
        .withMessage("Date is required")
        .isISO8601()
        .withMessage("Invalid date format"),

    body("status")
        .isIn(["Present", "Absent", "Late"])
        .withMessage("Status must be Present, Absent, or Late")

];

module.exports = {
    markAttendanceValidation
};