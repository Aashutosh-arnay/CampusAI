const express = require("express");
const router = express.Router();

const {
    createDepartment,
    getAllDepartments
} = require("../controllers/departmentController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Create Department
router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    createDepartment
);

// Get All Departments
router.get(
    "/",
    authMiddleware,
    getAllDepartments
);

module.exports = router;