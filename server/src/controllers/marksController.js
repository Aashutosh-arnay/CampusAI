const Marks = require("../models/Marks");
const Student = require("../models/Student");
const Subject = require("../models/Subject");
const FacultyAssignment = require("../models/FacultyAssignment");

// Create Marks
const createMarks = async (req, res) => {
    try {

        const {
            student,
            subject,
            facultyAssignment,
            examType,
            marksObtained,
            totalMarks,
            remarks
        } = req.body;

        // Check student exists
        const studentExists = await Student.findById(student);

        if (!studentExists) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        // Check subject exists
        const subjectExists = await Subject.findById(subject);

        if (!subjectExists) {
            return res.status(404).json({
                message: "Subject not found"
            });
        }

        // Check faculty assignment exists
        const assignmentExists = await FacultyAssignment.findById(facultyAssignment);

        if (!assignmentExists) {
            return res.status(404).json({
                message: "Faculty Assignment not found"
            });
        }

        const marks = await Marks.create({
            student,
            subject,
            facultyAssignment,
            examType,
            marksObtained,
            totalMarks,
            remarks
        });

        res.status(201).json({
            message: "Marks added successfully",
            marks
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};
// Get Student Marks
const getStudentMarks = async (req, res) => {
    try {

        const { studentId } = req.params;

        const marks = await Marks.find({
            student: studentId
        })
        .populate({
            path: "subject",
            select: "name code semester credits"
        })
        .populate({
            path: "facultyAssignment",
            select: "academicYear semester section"
        });

        res.status(200).json({
            count: marks.length,
            marks
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};
// Get Subject Marks
const getSubjectMarks = async (req, res) => {
    try {

        const { subjectId } = req.params;

        const marks = await Marks.find({
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
        });

        res.status(200).json({
            count: marks.length,
            marks
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};
// Update Marks
const updateMarks = async (req, res) => {
    try {

        const { id } = req.params;

        const marks = await Marks.findById(id);

        if (!marks) {
            return res.status(404).json({
                message: "Marks record not found"
            });
        }

        const updatedMarks = await Marks.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            message: "Marks updated successfully",
            marks: updatedMarks
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};
// Delete Marks
const deleteMarks = async (req, res) => {
    try {

        const { id } = req.params;

        const marks = await Marks.findById(id);

        if (!marks) {
            return res.status(404).json({
                message: "Marks record not found"
            });
        }

        await Marks.findByIdAndDelete(id);

        res.status(200).json({
            message: "Marks deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};
// Get Marks Percentage
const getMarksPercentage = async (req, res) => {
    try {

        const { studentId, subjectId } = req.params;

        const marks = await Marks.find({
            student: studentId,
            subject: subjectId
        });

        if (marks.length === 0) {
            return res.status(404).json({
                message: "No marks found"
            });
        }

        const totalObtained = marks.reduce(
            (sum, record) => sum + record.marksObtained,
            0
        );

        const totalMaximum = marks.reduce(
            (sum, record) => sum + record.totalMarks,
            0
        );

        const percentage =
            ((totalObtained / totalMaximum) * 100).toFixed(2);

        res.status(200).json({
            student: studentId,
            subject: subjectId,
            totalObtained,
            totalMaximum,
            percentage: `${percentage}%`
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};
module.exports = {
    createMarks,
    getStudentMarks,
    getSubjectMarks,
    updateMarks,
    deleteMarks,
    getMarksPercentage
};