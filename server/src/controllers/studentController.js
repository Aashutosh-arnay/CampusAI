const Student = require("../models/Student");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/AppError");
const ApiResponse = require("../utils/apiResponse");


// Create Student Profile
const createStudentProfile = asyncHandler(async (req, res) => {

    const {
        rollNumber,
        semester,
        department,
        course,
        section,
        skills,
        cgpa,
        phone
    } = req.body;

    const student = await Student.create({

        user: req.user.id,
        rollNumber,
        semester,
        department,
        course,
        section,
        skills,
        cgpa,
        phone

    });

    res.status(201).json(
        new ApiResponse(
            201,
            "Student profile created successfully",
            student
        )
    );
});


// Get Student Profile
const getStudentProfile = asyncHandler(async (req, res) => {


    const student = await Student.findOne({
        user: req.user.id
    })
    .populate("user", "name email role -_id")
    .populate("department", "name code -_id")
     .populate("course", "name code -_id");



    if (!student) {

        throw new ApiError(
            404,
            "Student profile not found"
        );

    }


    res.status(200).json(
        new ApiResponse(
            200,
            "Student profile fetched successfully",
            student
        )
    );

});


// Update Student Profile
const updateStudentProfile = asyncHandler(async (req, res) => {

    const {
        semester,
        section,
        skills,
        cgpa,
        phone
    } = req.body;

    const student = await Student.findOneAndUpdate(

        {
            user: req.user.id
        },

        {
            semester,
            section,
            skills,
            cgpa,
            phone
        },

        {
            new: true,
            runValidators: true
        }

    );

    if (!student) {

        throw new ApiError(
            404,
            "Student profile not found"
        );

    }

    res.status(200).json(
        new ApiResponse(
            200,
            "Student profile updated successfully",
            student
        )
    );
});

// Delete Student Profile
const deleteStudentProfile = asyncHandler(async (req,res)=>{


    const student = await Student.findOneAndDelete({

        user:req.user.id

    });


    if(!student){

        throw new ApiError(
            404,
            "Student profile not found"
        );

    }


    res.status(200).json(
        new ApiResponse(
            200,
            "Student profile deleted successfully",
            null
        )
    );

});


module.exports = {

    createStudentProfile,
    getStudentProfile,
    updateStudentProfile,
    deleteStudentProfile

};