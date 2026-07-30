const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({

    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true
    },

    facultyAssignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FacultyAssignment",
        required: true
    },

    day: {
        type: String,
        enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ],
        required: true
    },

    startTime: {
        type: String,
        required: true
    },

    endTime: {
        type: String,
        required: true
    },

    roomNumber: {
        type: String,
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
        required: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Timetable", timetableSchema);