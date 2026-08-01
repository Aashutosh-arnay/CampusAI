const Attendance = require("../models/Attendance");
const Enrollment = require("../models/Enrollment");
const FacultyAssignment = require("../models/FacultyAssignment");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/AppError");
const APIFeatures = require("../utils/apiFeatures");
const ApiResponse = require("../utils/apiResponse");
// Mark Attendance
const markAttendance = asyncHandler(async (req, res) => {
    const {
        enrollment,
        facultyAssignment,
        date,
        status,
        remarks
    } = req.body;
    const enrollmentExists =
    await Enrollment.findById(enrollment);
    if(!enrollmentExists){

        throw new ApiError(
            404,
            "Enrollment not found"
        );

    }
    const assignmentExists =
    await FacultyAssignment.findById(facultyAssignment);
    if(!assignmentExists){

        throw new ApiError(
            404,
            "Faculty assignment not found"
        );

    }



    const alreadyMarked =
    await Attendance.findOne({

        enrollment,
        date

    });



    if(alreadyMarked){

        throw new ApiError(
            400,
            "Attendance already marked for this date"
        );

    }



    const attendance =
    await Attendance.create({

        enrollment,
        facultyAssignment,
        date,
        status,
        remarks

    });



    res.status(201).json(

        new ApiResponse(
            201,
            "Attendance marked successfully",
            attendance
        )

    );


});



// Get Student Attendance
const getStudentAttendance = asyncHandler(async(req,res)=>{


    const {studentId}=req.params;



    const attendance =
    await Attendance.find()

    .populate({

        path:"enrollment",

        match:{
            student:studentId
        },

        populate:{
            path:"subject",
            select:"name code semester credits"
        }

    })

    .populate({

        path:"facultyAssignment",

        select:"academicYear semester section"

    });



    const filteredAttendance =
    attendance.filter(
        item=>item.enrollment !== null
    );



    res.status(200).json(

        new ApiResponse(
            200,
            "Attendance fetched successfully",
            filteredAttendance,
            filteredAttendance.length
        )

    );

});
// Get Subject Attendance
const getSubjectAttendance = asyncHandler(async (req, res) => {


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



    res.status(200).json(

        new ApiResponse(

            200,

            "Subject attendance fetched successfully",

            filteredAttendance,

            filteredAttendance.length

        )

    );


});

// Update Attendance
const updateAttendance = asyncHandler(async (req, res) => {


    const { id } = req.params;



    const attendance = await Attendance.findById(id);



    if (!attendance) {

        throw new ApiError(

            404,

            "Attendance not found"

        );

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



    res.status(200).json(

        new ApiResponse(

            200,

            "Attendance updated successfully",

            updatedAttendance

        )

    );


});




// Delete Attendance
const deleteAttendance = asyncHandler(async (req, res) => {


    const { id } = req.params;



    const attendance =
    await Attendance.findById(id);



    if (!attendance) {


        throw new ApiError(

            404,

            "Attendance not found"

        );

    }



    await Attendance.findByIdAndDelete(id);



    res.status(200).json(

        new ApiResponse(

            200,

            "Attendance deleted successfully",

            null

        )

    );


});
// Get Attendance Percentage
const getAttendancePercentage = asyncHandler(async (req, res) => {

    const {
        studentId,
        subjectId
    } = req.params;


    const enrollment = await Enrollment.findOne({

        student: studentId,
        subject: subjectId

    });


    if (!enrollment) {

        throw new ApiError(
            404,
            "Enrollment not found"
        );

    }


    const attendanceRecords = await Attendance.find({

        enrollment: enrollment._id

    });


    const totalClasses = attendanceRecords.length;


    const presentClasses = attendanceRecords.filter(

        attendance => attendance.status === "Present"

    ).length;


    const percentage = totalClasses === 0

        ? 0

        : ((presentClasses / totalClasses) * 100).toFixed(2);



    res.status(200).json(

        new ApiResponse(

            200,

            "Attendance percentage calculated successfully",

            {

                student: studentId,

                subject: subjectId,

                totalClasses,

                presentClasses,

                attendancePercentage: `${percentage}%`

            }

        )

    );


});




// Get All Attendance Records
const getAllAttendance = asyncHandler(async (req, res) => {


    const features = new APIFeatures(

        Attendance.find()

        .populate({

            path: "enrollment",

            populate: [

                {
                    path: "student",
                    populate: {
                        path: "user",
                        select: "name email"
                    }
                },

                {
                    path: "subject",
                    select: "name code semester credits"
                }

            ]

        })

        .populate({

            path: "facultyAssignment",

            populate: {

                path: "faculty",

                populate: {

                    path: "user",

                    select: "name email"

                }

            }

        }),

        req.query

    )
    .filter()
    .sort()
    .limitFields()
    .paginate();



    const attendance = await features.query;



    res.status(200).json(

        new ApiResponse(

            200,

            "Attendance records fetched successfully",

            attendance,

            attendance.length

        )

    );


});

module.exports = {
    markAttendance,
    getStudentAttendance,
    getSubjectAttendance,
    updateAttendance,
    deleteAttendance,
    getAttendancePercentage,
    getAllAttendance
    
};


