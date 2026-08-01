const Course = require("../models/Course");

const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/AppError");
const APIFeatures = require("../utils/apiFeatures");
const ApiResponse = require("../utils/apiResponse");


// Create Course
const createCourse = asyncHandler(async (req, res) => {


    const {
        name,
        code,
        department,
        duration,
        description
    } = req.body;


    const existingCourse = await Course.findOne({
        code
    });


    if(existingCourse){

        throw new ApiError(
            400,
            "Course already exists"
        );

    }


    const course = await Course.create({

        name,
        code,
        department,
        duration,
        description

    });


    res.status(201).json(

        new ApiResponse(
            201,
            "Course created successfully",
            course
        )

    );

});




// Get All Courses
const getAllCourse = asyncHandler(async(req,res)=>{


    const courses = await Course.find()
    .populate(
        "department",
        "name code -_id"
    );


    res.status(200).json(

        new ApiResponse(
            200,
            "Courses fetched successfully",
            courses,
            courses.length
        )

    );


});




// Get Course By ID
const getCourseById = asyncHandler(async(req,res)=>{


    const {id}=req.params;


    const course = await Course.findById(id)
    .populate(
        "department",
        "name code -_id"
    );


    if(!course){

        throw new ApiError(
            404,
            "Course not found"
        );

    }


    res.status(200).json(

        new ApiResponse(
            200,
            "Course fetched successfully",
            course
        )

    );


});




// Update Course
const updateCourse = asyncHandler(async(req,res)=>{


    const {id}=req.params;


    const course = await Course.findById(id);


    if(!course){

        throw new ApiError(
            404,
            "Course not found"
        );

    }



    if(req.body.code){

        const existingCourse =
        await Course.findOne({

            code:req.body.code,

            _id:{
                $ne:id
            }

        });


        if(existingCourse){

            throw new ApiError(
                400,
                "Course code already exists"
            );

        }

    }



    const updatedCourse =
    await Course.findByIdAndUpdate(

        id,

        req.body,

        {
            new:true,
            runValidators:true
        }

    )
    .populate(
        "department",
        "name code -_id"
    );



    res.status(200).json(

        new ApiResponse(
            200,
            "Course updated successfully",
            updatedCourse
        )

    );


});




// Delete Course
const deleteCourse = asyncHandler(async(req,res)=>{


    const {id}=req.params;


    const course =
    await Course.findById(id);


    if(!course){

        throw new ApiError(
            404,
            "Course not found"
        );

    }


    await Course.findByIdAndDelete(id);



    res.status(200).json(

        new ApiResponse(
            200,
            "Course deleted successfully",
            null
        )

    );


});



module.exports = {

    createCourse,
    getAllCourse,
    getCourseById,
    updateCourse,
    deleteCourse

};