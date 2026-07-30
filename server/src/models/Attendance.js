const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({

    enrollment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Enrollment",
        required: true
    },

    facultyAssignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FacultyAssignment",
        required: true
    },

    date: {
        type: Date,
        required: true
    },

    status: {
        type: String,
        enum: ["Present", "Absent", "Late"],
        default: "Present"
    },

    remarks: {
        type: String,
        default: ""
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Attendance", attendanceSchema);