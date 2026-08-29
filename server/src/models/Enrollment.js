const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({

    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
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
        required: true
    },

    enrolledAt: {
        type: Date,
        default: Date.now
    }

});
enrollmentSchema.index({ student: 1 });
enrollmentSchema.index({ subject: 1 });
enrollmentSchema.index(
    {
        student: 1,
        subject: 1,
        academicYear: 1,
        semester: 1
    },
    {
        unique: true
    }
);


module.exports = mongoose.model(
    "Enrollment",
    enrollmentSchema
);