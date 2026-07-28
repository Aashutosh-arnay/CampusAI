const Course = require("../models/Course");

// Create Course
const createCourse = async (req, res) => {
    try {

        const {
            name,
            code,
            department,
            duration,
            description
        } = req.body;

        // Check if course already exists
        const existingCourse = await Course.findOne({ code });

        if (existingCourse) {
            return res.status(400).json({
                message: "Course already exists"
            });
        }

        const course = await Course.create({
            name,
            code,
            department,
            duration,
            description
        });

        res.status(201).json({
            message: "Course created successfully",
            course
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};
// Get All Courses
const getAllCourse = async (req, res) => {
    try {

        const courses = await Course.find()
            .populate("department", "name code -_id");

        res.status(200).json({
            totalCourses: courses.length,
            courses
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};
// Get Course By ID
const getCourseById = async (req, res) => {
    try {

        const { id } = req.params;

        const course = await Course.findById(id)
            .populate("department", "name code -_id");

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        res.status(200).json({
            course
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};
// Update Course
const updateCourse = async (req, res) => {
    try {

        const { id } = req.params;

        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }
        // Check if another course already uses the same code
        if (req.body.code) {

            const existingCourse = await Course.findOne({
                code: req.body.code,
                _id: { $ne: id }
            });

            if (existingCourse) {
                return res.status(400).json({
                    message: "Course code already exists"
                });
            }
        }

        const updatedCourse = await Course.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).populate("department", "name code -_id");

        res.status(200).json({
            message: "Course updated successfully",
            course: updatedCourse
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

// Delete Course
const deleteCourse = async (req, res) => {
    try {

        const { id } = req.params;

        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        await Course.findByIdAndDelete(id);

        res.status(200).json({
            message: "Course deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};
module.exports = {
    createCourse,
    getAllCourse,
    getCourseById,
    updateCourse,
    deleteCourse

};