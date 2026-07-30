const Course = require("../models/Course");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// Create Course
const createCourse = asyncHandler(async (req, res) => {

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
        throw new AppError("Course already exists", 400);
    }

    const course = await Course.create({
        name,
        code,
        department,
        duration,
        description
    });

    res.status(201).json({
        success: true,
        message: "Course created successfully",
        data: course
    });

});
// Get All Courses
const getAllCourse = asyncHandler(async (req, res) => {

    const courses = await Course.find()
        .populate("department", "name code -_id");

    res.status(200).json({
        success: true,
        totalCourses: courses.length,
        data: courses
    });

});
// Get Course By ID
const getCourseById = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const course = await Course.findById(id)
        .populate("department", "name code -_id");

    if (!course) {
        throw new AppError("Course not found", 404);
    }

    res.status(200).json({
        success: true,
        data: course
    });

});
// Update Course
const updateCourse = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
        throw new AppError("Course not found", 404);
    }

    // Check if another course already uses the same code
    if (req.body.code) {

        const existingCourse = await Course.findOne({
            code: req.body.code,
            _id: { $ne: id }
        });

        if (existingCourse) {
            throw new AppError("Course code already exists", 400);
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
        success: true,
        message: "Course updated successfully",
        data: updatedCourse
    });

});
// Delete Course
const deleteCourse = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
        throw new AppError("Course not found", 404);
    }

    await Course.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: "Course deleted successfully"
    });

});
module.exports = {
    createCourse,
    getAllCourse,
    getCourseById,
    updateCourse,
    deleteCourse

};