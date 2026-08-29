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
timetableSchema.index({
    academicYear: 1,
    semester: 1,
    section: 1
});

timetableSchema.index({
    facultyAssignment: 1
});

module.exports = mongoose.model("Timetable", timetableSchema);