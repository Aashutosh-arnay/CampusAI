const Timetable = require("../models/Timetable");
const Subject = require("../models/Subject");
const FacultyAssignment = require("../models/FacultyAssignment");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/AppError");
const APIFeatures = require("../utils/apiFeatures");
const ApiResponse = require("../utils/apiResponse");

// Create Timetable
const createTimetable = asyncHandler(async (req, res) => {

    const {
        subject,
        facultyAssignment,
        day,
        startTime,
        endTime,
        roomNumber,
        academicYear,
        semester,
        section
    } = req.body;

    // Check Subject
    const subjectExists = await Subject.findById(subject);

    if (!subjectExists) {
        throw new ApiError(404, "Subject not found");
    }

    // Check Faculty Assignment
    const assignmentExists = await FacultyAssignment.findById(facultyAssignment);

    if (!assignmentExists) {
        throw new ApiError(404, "Faculty Assignment not found");
    }

    // Check Faculty Timetable Clash
    const facultyClash = await Timetable.findOne({
        facultyAssignment,
        day,
        startTime,
        endTime
    });

    if (facultyClash) {
        throw new ApiError(400, "Faculty already has a class at this time");
    }

    // Check Room Clash
    const roomClash = await Timetable.findOne({
        roomNumber,
        day,
        startTime,
        endTime
    });

    if (roomClash) {
        throw new ApiError(400, "Room is already occupied at this time");
    }

    // Create Timetable
    const timetable = await Timetable.create({
        subject,
        facultyAssignment,
        day,
        startTime,
        endTime,
        roomNumber,
        academicYear,
        semester,
        section
    });

    res.status(201).json(
        new ApiResponse(
            201,
            "Timetable created successfully",
            timetable
        )
    );

});
// Get Timetable by Section
const getSectionTimetable = asyncHandler(async (req, res) => {

    const { academicYear, semester, section } = req.params;

    const timetable = await Timetable.find({
        academicYear,
        semester,
        section
    })
        .populate({
            path: "subject",
            select: "name code credits"
        })
        .populate({
            path: "facultyAssignment",
            populate: {
                path: "faculty",
                select: "employeeId designation",
                populate: {
                    path: "user",
                    select: "name email"
                }
            }
        })
        .sort({
            day: 1,
            startTime: 1
        });

    res.status(200).json(
        new ApiResponse(
            200,
            "Section timetable fetched successfully",
            timetable,
            timetable.length
        )
    );

});
// Get Faculty Timetable
const getFacultyTimetable = asyncHandler(async (req, res) => {

    const { facultyAssignmentId } = req.params;

    // Check Faculty Assignment exists
    const assignment = await FacultyAssignment.findById(facultyAssignmentId);

    if (!assignment) {
        throw new ApiError(404, "Faculty Assignment not found");
    }

    const timetable = await Timetable.find({
        facultyAssignment: facultyAssignmentId
    })
        .populate({
            path: "subject",
            select: "name code credits"
        })
        .sort({
            day: 1,
            startTime: 1
        });

    res.status(200).json(
        new ApiResponse(
            200,
            "Faculty timetable fetched successfully",
            timetable,
            timetable.length
        )
    );

});
// Update Timetable
const updateTimetable = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const updatedTimetable = await Timetable.findByIdAndUpdate(
        id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    );

    if (!updatedTimetable) {
        throw new ApiError(404, "Timetable not found");
    }

    res.status(200).json(
        new ApiResponse(
            200,
            "Timetable updated successfully",
            updatedTimetable
        )
    );

});
// Delete Timetable
const deleteTimetable = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const deletedTimetable = await Timetable.findByIdAndDelete(id);

    if (!deletedTimetable) {
        throw new ApiError(404, "Timetable not found");
    }

    res.status(200).json(
        new ApiResponse(
            200,
            "Timetable deleted successfully",
            null
        )
    );

});
module.exports = {
    createTimetable,
    getSectionTimetable,
    getFacultyTimetable,
    updateTimetable,
    deleteTimetable
};