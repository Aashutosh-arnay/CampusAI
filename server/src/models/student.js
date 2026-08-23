const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        rollNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            required: true
        },

        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },

        section: {
            type: String,
            required: true,
            trim: true,
            uppercase: true
        },

        semester: {
            type: Number,
            required: true
        },

        skills: [
            {
                type: String,
                trim: true
            }
        ],

        cgpa: {
            type: Number
        },

        phone: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Student", studentSchema);