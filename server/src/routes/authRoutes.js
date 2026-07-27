const express = require("express");
const router = express.Router();

const { registerUser, loginUser } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");


// Register API
router.post("/register", registerUser);


// Login API
router.post("/login", loginUser);


// Protected Profile API
router.get(
    "/admin",
    authMiddleware,
    roleMiddleware("admin"),
    (req, res) => {
        res.json({
            message: "Welcome Admin"
        });
    }
);


module.exports = router;