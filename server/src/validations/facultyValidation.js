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

module.exports = {
    createFacultyValidation
};