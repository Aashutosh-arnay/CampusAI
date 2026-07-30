const express = require("express");
const router = express.Router();
const validate = require("../middleware/validationMiddleware");


const {
    createSubjectValidation
} = require("../validations/subjectValidation");

const {
    createSubject,
    getAllSubjects,
    getSubjectById,
    updateSubject,
    deleteSubject
} = require("../controllers/subjectController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Create Subject (Admin Only)
router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    createSubjectValidation,
    validate,
    createSubject
);
// Get All Subjects
router.get(
    "/",
    authMiddleware,
    getAllSubjects
);
// Get Subject By ID
router.get(
    "/:id",
    authMiddleware,
    getSubjectById
);
// Update Subject (Admin Only)
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    updateSubject
);
// Delete Subject (Admin Only)
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    deleteSubject
);
module.exports = router;