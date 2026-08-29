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
facultyAssignmentSchema.index({ faculty: 1 });
facultyAssignmentSchema.index(
    {
        faculty: 1,
        subject: 1,
        academicYear: 1,
        semester: 1,
        section: 1
    },
    {
        unique: true
    }
);
module.exports = mongoose.model(
    "FacultyAssignment",
    facultyAssignmentSchema
);