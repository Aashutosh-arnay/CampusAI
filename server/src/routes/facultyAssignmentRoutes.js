const express = require("express");
const router = express.Router();

const {
    assignFaculty,
    getAllAssignments,
    getAssignmentById,
    updateAssignment,
    deleteAssignment

} = require("../controllers/facultyAssignmentController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Assign Faculty to Subject (Admin Only)
router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    assignFaculty
);
// Get All Faculty Assignments
router.get(
    "/",
    authMiddleware,
    getAllAssignments
);
// Get Assignment By ID
router.get(
    "/:id",
    authMiddleware,
    getAssignmentById
);
// Update Assignment (Admin Only)
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    updateAssignment
);
// Delete Assignment (Admin Only)
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    deleteAssignment
);

module.exports = router;