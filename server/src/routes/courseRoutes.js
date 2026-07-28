const express = require("express");
const router = express.Router();

const {
    createCourse,
    getAllCourse,
    getCourseById,
    updateCourse,
    deleteCourse
} = require("../controllers/courseController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Create Course (Admin Only)
router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    createCourse
);

// Get All Courses
router.get(
    "/",
    authMiddleware,
    getAllCourse
);
// Get Course By ID
router.get(
    "/:id",
    authMiddleware,
    getCourseById
);
// Update Course (Admin Only)
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    updateCourse
);
// Delete Course (Admin Only)
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    deleteCourse
);
module.exports = router;