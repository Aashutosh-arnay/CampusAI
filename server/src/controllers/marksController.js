const Marks = require("../models/Marks");
const Student = require("../models/Student");
const Subject = require("../models/Subject");
const FacultyAssignment = require("../models/FacultyAssignment");
const asyncHandler = require("express-async-handler");
const APIFeatures = require("../utils/apiFeatures");
const ApiResponse = require("../utils/apiResponse");

// Create Marks
const createMarks = asyncHandler(async (req, res) => {

    const {
        student,
        subject,
        facultyAssignment,
        examType,
        marksObtained,
        totalMarks,
        remarks
    } = req.body;

    // Check Student exists
    const studentExists = await Student.findById(student);

    if (!studentExists) {
        throw new ApiError(404, "Student not found");
    }

    // Check Subject exists
    const subjectExists = await Subject.findById(subject);

    if (!subjectExists) {
        throw new ApiError(404, "Subject not found");
    }

    // Check Faculty Assignment exists
    const assignmentExists = await FacultyAssignment.findById(facultyAssignment);

    if (!assignmentExists) {
        throw new ApiError(404, "Faculty Assignment not found");
    }

    // Create Marks
    const marks = await Marks.create({
        student,
        subject,
        facultyAssignment,
        examType,
        marksObtained,
        totalMarks,
        remarks
    });

    res.status(201).json(
        new ApiResponse(
            201,
            "Marks added successfully",
            marks
        )
    );

});
// Get Student Marks
const getStudentMarks = asyncHandler(async (req, res) => {

    const { studentId } = req.params;

    const features = new APIFeatures(
        Marks.find({
            student: studentId
        })
            .populate({
                path: "subject",
                select: "name code semester credits"
            })
            .populate({
                path: "facultyAssignment",
                select: "academicYear semester section"
            }),
        req.query
    )
        .sort()
        .limitFields()
        .paginate();

    const marks = await features.query;

    res.status(200).json(
        new ApiResponse(
            200,
            "Student marks fetched successfully",
            marks,
            marks.length
        )
    );

});
// Get Subject Marks
const getSubjectMarks = asyncHandler(async (req, res) => {

    const { subjectId } = req.params;

    // Check Subject exists
    const subject = await Subject.findById(subjectId);

    if (!subject) {
        throw new ApiError(404, "Subject not found");
    }

    const features = new APIFeatures(
        Marks.find({
            subject: subjectId
        })
            .populate({
                path: "student",
                select: "rollNumber",
                populate: {
                    path: "user",
                    select: "name email"
                }
            })
            .populate({
                path: "facultyAssignment",
                select: "academicYear semester section"
            }),
        req.query
    )
        .sort()
        .limitFields()
        .paginate();

    const marks = await features.query;

    res.status(200).json(
        new ApiResponse(
            200,
            "Subject marks fetched successfully",
            marks,
            marks.length
        )
    );

});
// Update Marks
const updateMarks = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const updatedMarks = await Marks.findByIdAndUpdate(
        id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    );

    if (!updatedMarks) {
        throw new ApiError(404, "Marks record not found");
    }

    res.status(200).json(
        new ApiResponse(
            200,
            "Marks updated successfully",
            updatedMarks
        )
    );

});

// Delete Marks
const deleteMarks = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const deletedMarks = await Marks.findByIdAndDelete(id);

    if (!deletedMarks) {
        throw new ApiError(404, "Marks record not found");
    }

    res.status(200).json(
        new ApiResponse(
            200,
            "Marks deleted successfully",
            null
        )
    );

});
// Get Marks Percentage
const getMarksPercentage = asyncHandler(async (req, res) => {

    const { studentId, subjectId } = req.params;

    // Check Student exists
    const student = await Student.findById(studentId);

    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    // Check Subject exists
    const subject = await Subject.findById(subjectId);

    if (!subject) {
        throw new ApiError(404, "Subject not found");
    }

    // Fetch Marks
    const marks = await Marks.find({
        student: studentId,
        subject: subjectId
    });

    if (marks.length === 0) {
        throw new ApiError(404, "No marks found");
    }

    // Calculate Total Obtained Marks
    const totalObtained = marks.reduce(
        (sum, record) => sum + record.marksObtained,
        0
    );

    // Calculate Total Maximum Marks
    const totalMaximum = marks.reduce(
        (sum, record) => sum + record.totalMarks,
        0
    );

    // Calculate Percentage
    const percentage = (
        (totalObtained / totalMaximum) * 100
    ).toFixed(2);

    res.status(200).json(
        new ApiResponse(
            200,
            "Marks percentage calculated successfully",
            {
                student: studentId,
                subject: subjectId,
                totalObtained,
                totalMaximum,
                percentage: `${percentage}%`
            }
        )
    );

});
module.exports = {
    createMarks,
    getStudentMarks,
    getSubjectMarks,
    updateMarks,
    deleteMarks,
    getMarksPercentage
};