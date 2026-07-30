const FacultyAssignment = require("../models/FacultyAssignment");
const Faculty = require("../models/Faculty");
const Subject = require("../models/Subject");

// Assign Faculty to Subject
const assignFaculty = async (req, res) => {
    try {

        const {
            faculty,
            subject,
            academicYear,
            semester,
            section
        } = req.body;

        // Check faculty exists
        const facultyExists = await Faculty.findById(faculty);

        if (!facultyExists) {
            return res.status(404).json({
                message: "Faculty not found"
            });
        }

        // Check subject exists
        const subjectExists = await Subject.findById(subject);

        if (!subjectExists) {
            return res.status(404).json({
                message: "Subject not found"
            });
        }

        // Prevent duplicate assignment
        const existingAssignment = await FacultyAssignment.findOne({
            faculty,
            subject,
            academicYear,
            semester,
            section
        });

        if (existingAssignment) {
            return res.status(400).json({
                message: "Faculty is already assigned to this subject"
            });
        }

        const assignment = await FacultyAssignment.create({
            faculty,
            subject,
            academicYear,
            semester,
            section
        });

        res.status(201).json({
            message: "Faculty assigned successfully",
            assignment
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};
// Get All Faculty Assignments
const getAllAssignments = async (req, res) => {
    try {

        const assignments = await FacultyAssignment.find()

            .populate({
                path: "faculty",
                select: "employeeId designation",
                populate: {
                    path: "user",
                    select: "name email"
                }
            })

            .populate({
                path: "subject",
                select: "name code semester"
            });

        res.status(200).json({
            totalAssignments: assignments.length,
            assignments
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};
// Get Faculty Assignment By ID
const getAssignmentById = async (req, res) => {
    try {

        const { id } = req.params;

        const assignment = await FacultyAssignment.findById(id)

            .populate({
                path: "faculty",
                select: "employeeId designation",
                populate: {
                    path: "user",
                    select: "name email"
                }
            })

            .populate({
                path: "subject",
                select: "name code semester credits"
            });

        if (!assignment) {
            return res.status(404).json({
                message: "Assignment not found"
            });
        }

        res.status(200).json({
            assignment
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};
// Update Faculty Assignment
const updateAssignment = async (req, res) => {
    try {

        const { id } = req.params;

        const assignment = await FacultyAssignment.findById(id);

        if (!assignment) {
            return res.status(404).json({
                message: "Assignment not found"
            });
        }

        // If faculty is being updated, verify it exists
        if (req.body.faculty) {

            const faculty = await Faculty.findById(req.body.faculty);

            if (!faculty) {
                return res.status(404).json({
                    message: "Faculty not found"
                });
            }
        }

        // If subject is being updated, verify it exists
        if (req.body.subject) {

            const subject = await Subject.findById(req.body.subject);

            if (!subject) {
                return res.status(404).json({
                    message: "Subject not found"
                });
            }
        }

        const updatedAssignment = await FacultyAssignment.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        )
        .populate({
            path: "faculty",
            select: "employeeId designation",
            populate: {
                path: "user",
                select: "name email"
            }
        })
        .populate({
            path: "subject",
            select: "name code semester"
        });

        res.status(200).json({
            message: "Assignment updated successfully",
            assignment: updatedAssignment
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};
// Delete Faculty Assignment
const deleteAssignment = async (req, res) => {
    try {

        const { id } = req.params;

        const assignment = await FacultyAssignment.findById(id);

        if (!assignment) {
            return res.status(404).json({
                message: "Assignment not found"
            });
        }

        await FacultyAssignment.findByIdAndDelete(id);

        res.status(200).json({
            message: "Assignment deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};
module.exports = {
    assignFaculty,
    getAllAssignments,
    getAssignmentById,
    updateAssignment,
    deleteAssignment

};