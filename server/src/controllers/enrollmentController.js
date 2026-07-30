const Enrollment = require("../models/Enrollment");
const Student = require("../models/Student");
const Subject = require("../models/Subject");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");


// Create Enrollment
const createEnrollment = asyncHandler(async (req, res) => {

    const {
        student,
        subject,
        academicYear,
        semester,
        section
    } = req.body;

    // Check Student exists
    const studentExists = await Student.findById(student);

    if (!studentExists) {
        throw new AppError("Student not found", 404);
    }

    // Check Subject exists
    const subjectExists = await Subject.findById(subject);

    if (!subjectExists) {
        throw new AppError("Subject not found", 404);
    }

    // Check duplicate enrollment
    const alreadyEnrolled = await Enrollment.findOne({
        student,
        subject,
        academicYear,
        semester
    });

    if (alreadyEnrolled) {
        throw new AppError(
            "Student already enrolled in this subject",
            400
        );
    }

    const enrollment = await Enrollment.create({
        student,
        subject,
        academicYear,
        semester,
        section
    });

    res.status(201).json({
        success: true,
        message: "Student enrolled successfully",
        data: enrollment
    });

});
// Get Student Enrollments
const getStudentEnrollments = asyncHandler(async (req, res) => {

    const { studentId } = req.params;

    const student = await Student.findById(studentId);

    if (!student) {
        throw new AppError("Student not found", 404);
    }

    const enrollments = await Enrollment.find({
        student: studentId
    }).populate({
        path: "subject",
        select: "name code semester credits"
    });

    res.status(200).json({
        success: true,
        count: enrollments.length,
        data: enrollments
    });

});
// Get Students Enrolled in a Subject
const getSubjectStudents = asyncHandler(async (req, res) => {

    const { subjectId } = req.params;

    const subject = await Subject.findById(subjectId);

    if (!subject) {
        throw new AppError("Subject not found", 404);
    }

    const enrollments = await Enrollment.find({
        subject: subjectId
    }).populate({
        path: "student",
        select: "rollNumber section semester",
        populate: {
            path: "user",
            select: "name email"
        }
    });

    res.status(200).json({
        success: true,
        count: enrollments.length,
        data: enrollments
    });

});
// Delete Enrollment
const deleteEnrollment = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const enrollment = await Enrollment.findById(id);

    if (!enrollment) {
        throw new AppError("Enrollment not found", 404);
    }

    await Enrollment.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: "Enrollment deleted successfully"
    });

});

module.exports = {
    createEnrollment,
    getStudentEnrollments,
    getSubjectStudents,
    deleteEnrollment

};