const express = require("express");
const router = express.Router();
const validate = require("../middleware/validationMiddleware");

const {
    createFacultyValidation,
    updateFacultyValidation
} = require("../validations/facultyValidation");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
    getFacultyProfile,
    updateFacultyProfile
} = require("../controllers/facultyController");


// Get faculty profile
/**
 * @swagger
 * /api/faculty/profile:
 *   get:
 *     summary: Get faculty profile
 *     tags: [Faculty]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Faculty profile fetched successfully
 *       401:
 *         description: Authentication failed
 *       403:
 *         description: Access denied
 *       404:
 *         description: Faculty profile not found
 */
router.get(
    "/profile",
    authMiddleware,
    roleMiddleware("faculty"),
    getFacultyProfile
);
// Update faculty profile
/**
 * @swagger
 * /api/faculty/profile:
 *   put:
 *     summary: Update faculty profile
 *     tags: [Faculty]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               designation:
 *                 type: string
 *                 example: "Assistant Professor"
 *               department:
 *                 type: string
 *                 example: "60f7c0..."
 *             example:
 *               phone: "9876543210"
 *               designation: "Assistant Professor"
 *     responses:
 *       200:
 *         description: Faculty profile updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication failed
 *       403:
 *         description: Access denied
 *       404:
 *         description: Faculty profile not found
 */
router.put(
    "/profile",
    authMiddleware,
    roleMiddleware("faculty"),
    updateFacultyValidation,
    validate,
    updateFacultyProfile
);

module.exports = router;