const mongoose = require("mongoose");

const facultyAssignmentSchema = new mongoose.Schema(
    {
        faculty: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Faculty",
            required: true
        },

        subject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subject",
            required: true
        },

        academicYear: {
            type: String,
            required: true
        },

        semester: {
            type: Number,
            required: true
        },

        section: {
            type: String,
            required: true,
            uppercase: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "FacultyAssignment",
    facultyAssignmentSchema
);