const Timetable = require("../models/Timetable");
const Subject = require("../models/Subject");
const FacultyAssignment = require("../models/FacultyAssignment");

// Create Timetable
const createTimetable = async (req, res) => {
    try {

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
            return res.status(404).json({
                message: "Subject not found"
            });
        }

        // Check Faculty Assignment
        const assignmentExists = await FacultyAssignment.findById(facultyAssignment);

        if (!assignmentExists) {
            return res.status(404).json({
                message: "Faculty Assignment not found"
            });
        }
        // Check faculty timetable clash
        const facultyClash = await Timetable.findOne({
            facultyAssignment,
            day,
            startTime,
            endTime
        });

        if (facultyClash) {
            return res.status(400).json({
                message: "Faculty already has a class at this time"
            });
        }

        // Check room clash
        const roomClash = await Timetable.findOne({
            roomNumber,
            day,
            startTime,
            endTime
        });

        if (roomClash) {
            return res.status(400).json({
                message: "Room is already occupied at this time"
            });
        }
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

        res.status(201).json({
            message: "Timetable created successfully",
            timetable
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};
// Get Timetable by Section
const getSectionTimetable = async (req, res) => {
    try {

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

        res.status(200).json({
            count: timetable.length,
            timetable
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};
// Get Faculty Timetable
const getFacultyTimetable = async (req, res) => {
    try {

        const { facultyAssignmentId } = req.params;

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

        res.status(200).json({
            count: timetable.length,
            timetable
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};
// Update Timetable
const updateTimetable = async (req, res) => {
    try {

        const { id } = req.params;

        const timetable = await Timetable.findById(id);

        if (!timetable) {
            return res.status(404).json({
                message: "Timetable not found"
            });
        }

        const updatedTimetable = await Timetable.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            message: "Timetable updated successfully",
            timetable: updatedTimetable
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};
// Delete Timetable
const deleteTimetable = async (req, res) => {
    try {

        const { id } = req.params;

        const timetable = await Timetable.findById(id);

        if (!timetable) {
            return res.status(404).json({
                message: "Timetable not found"
            });
        }

        await Timetable.findByIdAndDelete(id);

        res.status(200).json({
            message: "Timetable deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};
module.exports = {
    createTimetable,
    getSectionTimetable,
    getFacultyTimetable,
    updateTimetable,
    deleteTimetable
};