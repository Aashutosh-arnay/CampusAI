const Student = require("../models/Student");
const Faculty = require("../models/Faculty");
const User = require("../models/User");

const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/AppError");
const APIFeatures = require("../utils/apiFeatures");
const ApiResponse = require("../utils/apiResponse");


// Get All Students
const getAllStudents = asyncHandler(async (req, res) => {

    const features = new APIFeatures(
        Student.find()
            .populate("user", "name email role"),
        req.query
    )
    .filter()
    .search(["rollNumber"])
    .sort()
    .limitFields()
    .paginate();

    const students = await features.query;

    res.status(200).json(
        new ApiResponse(
            200,
            "Students fetched successfully",
            students,
            students.length
        )
    );

});


// Get All Faculty
const getAllFaculty = asyncHandler(async (req, res) => {

    const features = new APIFeatures(
        Faculty.find()
            .populate("user", "name email role"),
        req.query
    )
    .filter()
    .search(["employeeId"])
    .sort()
    .limitFields()
    .paginate();

    const faculty = await features.query;

    res.status(200).json(
        new ApiResponse(
            200,
            "Faculty fetched successfully",
            faculty,
            faculty.length
        )
    );

});


// Delete Student
const deleteStudent = asyncHandler(async (req, res) => {

    const student = await Student.findById(req.params.id);

    if (!student) {
        throw new ApiError(
            404,
            "Student not found"
        );
    }

    await User.findByIdAndDelete(student.user);

    await Student.findByIdAndDelete(req.params.id);

    res.status(200).json(
        new ApiResponse(
            200,
            "Student deleted successfully",
            null
        )
    );

});


// Delete Faculty
const deleteFaculty = asyncHandler(async (req, res) => {

    const faculty = await Faculty.findById(req.params.id);

    if (!faculty) {
        throw new ApiError(
            404,
            "Faculty not found"
        );
    }

    await User.findByIdAndDelete(faculty.user);

    await Faculty.findByIdAndDelete(req.params.id);

    res.status(200).json(
        new ApiResponse(
            200,
            "Faculty deleted successfully",
            null
        )
    );

});


module.exports = {
    getAllStudents,
    getAllFaculty,
    deleteStudent,
    deleteFaculty
};