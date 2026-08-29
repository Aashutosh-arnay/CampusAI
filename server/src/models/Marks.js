const mongoose = require("mongoose");

const marksSchema = new mongoose.Schema({

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

    facultyAssignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FacultyAssignment",
        required: true
    },

    examType: {
        type: String,
        enum: ["Quiz", "Midterm", "End Semester", "Assignment", "Lab"],
        required: true
    },

    marksObtained: {
        type: Number,
        required: true,
        min: 0
    },

    totalMarks: {
        type: Number,
        required: true,
        min: 1
    },

    remarks: {
        type: String,
        default: ""
    }

}, {
    timestamps: true
});
marksSchema.index({ student: 1 });
marksSchema.index({ subject: 1 });
module.exports = mongoose.model("Marks", marksSchema);