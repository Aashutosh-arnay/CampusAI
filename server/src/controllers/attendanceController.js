const Attendance = require("../models/Attendance");
const Enrollment = require("../models/Enrollment");
const FacultyAssignment = require("../models/FacultyAssignment");

// Mark Attendance
const markAttendance = async (req, res) => {
    try {

        const {
            enrollment,
            facultyAssignment,
            date,
            status,
            remarks
        } = req.body;

        // Check enrollment exists
        const enrollmentExists = await Enrollment.findById(enrollment);

        if (!enrollmentExists) {
            return res.status(404).json({
                message: "Enrollment not found"
            });
        }

        // Check faculty assignment exists
        const assignmentExists = await FacultyAssignment.findById(facultyAssignment);

        if (!assignmentExists) {
            return res.status(404).json({
                message: "Faculty assignment not found"
            });
        }

        // Prevent duplicate attendance for the same date
        const alreadyMarked = await Attendance.findOne({
            enrollment,
            date
        });

        if (alreadyMarked) {
            return res.status(400).json({
                message: "Attendance already marked for this date"
            });
        }

        const attendance = await Attendance.create({
            enrollment,
            facultyAssignment,
            date,
            status,
            remarks
        });

        res.status(201).json({
            message: "Attendance marked successfully",
            attendance
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};
// Get Student Attendance
const getStudentAttendance = async (req, res) => {
    try {

        const { studentId } = req.params;

        const attendance = await Attendance.find()
            .populate({
                path: "enrollment",
                match: {
                    student: studentId
                },
                populate: {
                    path: "subject",
                    select: "name code semester credits"
                }
            })
            .populate({
                path: "facultyAssignment",
                select: "academicYear semester section"
            });


        const filteredAttendance = attendance.filter(
            item => item.enrollment !== null
        );


        res.status(200).json({
            count: filteredAttendance.length,
            attendance: filteredAttendance
        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};
// Get Subject Attendance
const getSubjectAttendance = async (req, res) => {
    try {

        const { subjectId } = req.params;

        const attendance = await Attendance.find()
            .populate({
                path: "enrollment",
                match: {
                    subject: subjectId
                },
                populate: {
                    path: "student",
                    select: "rollNumber",
                    populate: {
                        path: "user",
                        select: "name email"
                    }
                }
            })
            .populate({
                path: "facultyAssignment",
                select: "academicYear semester section"
            });


        const filteredAttendance = attendance.filter(
            item => item.enrollment !== null
        );


        res.status(200).json({
            count: filteredAttendance.length,
            attendance: filteredAttendance
        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};
// Update Attendance
const updateAttendance = async (req, res) => {

    try {

        const { id } = req.params;


        const attendance = await Attendance.findById(id);


        if (!attendance) {
            return res.status(404).json({
                message: "Attendance not found"
            });
        }


        const updatedAttendance =
            await Attendance.findByIdAndUpdate(
                id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );


        res.status(200).json({

            message: "Attendance updated successfully",
            attendance: updatedAttendance

        });


    } catch(error){

        res.status(500).json({
            message: error.message
        });

    }

};
// Delete Attendance
const deleteAttendance = async (req, res) => {

    try {

        const { id } = req.params;


        const attendance = await Attendance.findById(id);


        if (!attendance) {
            return res.status(404).json({
                message: "Attendance not found"
            });
        }


        await Attendance.findByIdAndDelete(id);


        res.status(200).json({

            message: "Attendance deleted successfully"

        });


    } catch(error){

        res.status(500).json({
            message: error.message
        });

    }

};
// Get Attendance Percentage
const getAttendancePercentage = async (req, res) => {

    try {

        const { studentId, subjectId } = req.params;


        const enrollments = await Enrollment.findOne({
            student: studentId,
            subject: subjectId
        });


        if (!enrollments) {
            return res.status(404).json({
                message: "Enrollment not found"
            });
        }


        const attendanceRecords = await Attendance.find({
            enrollment: enrollments._id
        });


        const totalClasses = attendanceRecords.length;


        const presentClasses = attendanceRecords.filter(
            attendance => attendance.status === "Present"
        ).length;


        const percentage = totalClasses === 0
            ? 0
            : ((presentClasses / totalClasses) * 100).toFixed(2);


        res.status(200).json({

            student: studentId,
            subject: subjectId,
            totalClasses,
            presentClasses,
            attendancePercentage: `${percentage}%`

        });


    } catch(error){

        res.status(500).json({
            message: error.message
        });

    }

};
// Get All Attendance Records
const getAllAttendance = async (req, res) => {
    try {

        const attendance = await Attendance.find();

        console.log("Attendance count:", await Attendance.countDocuments());

        res.status(200).json({
            count: attendance.length,
            attendance
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};
module.exports = {
    markAttendance,
    getStudentAttendance,
    getSubjectAttendance,
    updateAttendance,
    deleteAttendance,
    getAttendancePercentage,
    getAllAttendance
    
};