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
attendanceSchema.index({ enrollment: 1 });
attendanceSchema.index({ facultyAssignment: 1 });
attendanceSchema.index({ enrollment: 1, date: 1 });
attendanceSchema.index(
    {
        enrollment: 1,
        facultyAssignment: 1,
        date: 1
    },
    {
        unique: true
    }
);
module.exports = mongoose.model("Attendance", attendanceSchema);