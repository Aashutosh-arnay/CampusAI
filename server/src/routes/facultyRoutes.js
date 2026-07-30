const express = require("express");
const router = express.Router();
const validate = require("../middleware/validationMiddleware");

const {
    createFacultyValidation
} = require("../validations/facultyValidation");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
    getFacultyProfile,
    updateFacultyProfile
} = require("../controllers/facultyController");


// Get faculty profile
router.get(
    "/profile",
    authMiddleware,
    roleMiddleware("faculty"),
    getFacultyProfile
);
// Update faculty profile
router.put(
    "/profile",
    authMiddleware,
    roleMiddleware("faculty"),
    createFacultyValidation,
    validate,
    updateFacultyProfile
);


module.exports = router;