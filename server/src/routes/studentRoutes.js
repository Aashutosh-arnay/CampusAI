const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
    createStudentProfile,
    getStudentProfile,
    updateStudentProfile,
    deleteStudentProfile
} = require("../controllers/studentController");


// Create student profile
router.post(
    "/profile",
    authMiddleware,
    roleMiddleware("student"),
    createStudentProfile
);


// Get student profile
router.get(
    "/profile",
    authMiddleware,
    roleMiddleware("student"),
    getStudentProfile
);
router.put(
    "/profile",
    authMiddleware,
    roleMiddleware("student"),
    updateStudentProfile
);
// Delete student profile
router.delete(
    "/profile",
    authMiddleware,
    roleMiddleware("student"),
    deleteStudentProfile
);


module.exports = router;