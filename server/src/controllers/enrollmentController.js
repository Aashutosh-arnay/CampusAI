const Enrollment = require("../models/Enrollment");
const Student = require("../models/Student");
const Subject = require("../models/Subject");

const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/AppError");
const APIFeatures = require("../utils/apiFeatures");
const ApiResponse = require("../utils/apiResponse");


// Create Enrollment
const createEnrollment = asyncHandler(async (req, res) => {


    const {
        student,
        subject,
        academicYear,
        semester,
        section
    } = req.body;


    const studentExists = await Student.findById(student);

    if(!studentExists){

        throw new ApiError(
            404,
            "Student not found"
        );

    }


    const subjectExists = await Subject.findById(subject);

    if(!subjectExists){

        throw new ApiError(
            404,
            "Subject not found"
        );

    }


    const alreadyEnrolled = await Enrollment.findOne({

        student,
        subject,
        academicYear,
        semester

    });


    if(alreadyEnrolled){

        throw new ApiError(
            400,
            "Student already enrolled in this subject"
        );

    }


    const enrollment = await Enrollment.create({

        student,
        subject,
        academicYear,
        semester,
        section

    });


    res.status(201).json(

        new ApiResponse(
            201,
            "Student enrolled successfully",
            enrollment
        )

    );

});



// Get Student Enrollments
const getStudentEnrollments = asyncHandler(async(req,res)=>{


    const {studentId}=req.params;


    const student = await Student.findById(studentId);


    if(!student){

        throw new ApiError(
            404,
            "Student not found"
        );

    }


    const features = new APIFeatures(

        Enrollment.find({
            student:studentId
        })
        .populate({
            path:"subject",
            select:"name code semester credits"
        }),

        req.query

    )
    .sort()
    .limitFields()
    .paginate();



    const enrollments = await features.query;



    res.status(200).json(

        new ApiResponse(
            200,
            "Enrollments fetched successfully",
            enrollments,
            enrollments.length
        )

    );


});



// Get Students Enrolled in Subject
const getSubjectStudents = asyncHandler(async(req,res)=>{


    const {subjectId}=req.params;


    const subject = await Subject.findById(subjectId);


    if(!subject){

        throw new ApiError(
            404,
            "Subject not found"
        );

    }



    const enrollments = await Enrollment.find({

        subject:subjectId

    })
    .populate({

        path:"student",

        select:"rollNumber section semester",

        populate:{
            path:"user",
            select:"name email"
        }

    });



    res.status(200).json(

        new ApiResponse(
            200,
            "Subject students fetched successfully",
            enrollments,
            enrollments.length
        )

    );


});



// Delete Enrollment
const deleteEnrollment = asyncHandler(async(req,res)=>{


    const {id}=req.params;


    const enrollment =
    await Enrollment.findById(id);



    if(!enrollment){

        throw new ApiError(
            404,
            "Enrollment not found"
        );

    }



    await Enrollment.findByIdAndDelete(id);



    res.status(200).json(

        new ApiResponse(
            200,
            "Enrollment deleted successfully",
            null
        )

    );


});



module.exports = {

    createEnrollment,
    getStudentEnrollments,
    getSubjectStudents,
    deleteEnrollment

};