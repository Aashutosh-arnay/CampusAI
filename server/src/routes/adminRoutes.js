const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
    getAllStudents,
    getAllFaculty,
    deleteStudent,
    deleteFaculty
} = require("../controllers/adminController");

const {
    createDepartment,
    getAllDepartments
} = require("../controllers/departmentController");




router.get(
    "/test",
    authMiddleware,
    adminMiddleware,
    (req,res)=>{
        res.json({
            message:"Admin access granted"
        });
    }
);

router.get(
    "/students",
    authMiddleware,
    adminMiddleware,
    getAllStudents
);
// Get all faculty
router.get(
    "/faculty",
    authMiddleware,
    adminMiddleware,
    getAllFaculty
);
// Delete student
router.delete(
    "/students/:id",
    authMiddleware,
    adminMiddleware,
    deleteStudent
);
// Delete faculty
router.delete(
    "/faculty/:id",
    authMiddleware,
    adminMiddleware,
    deleteFaculty
);
// Create Department
router.post(
    "/departments",
    authMiddleware,
    adminMiddleware,
    createDepartment
);

// Get All Departments
router.get(
    "/departments",
    authMiddleware,
    adminMiddleware,
    getAllDepartments
);


module.exports = router;