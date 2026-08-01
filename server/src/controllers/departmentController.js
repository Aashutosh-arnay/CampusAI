const Department = require("../models/Department");
const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/AppError");
const APIFeatures = require("../utils/apiFeatures");
const ApiResponse = require("../utils/apiResponse");



// Create Department
const createDepartment = asyncHandler(async (req, res) => {


    const {
        name,
        code,
        description,
        hod
    } = req.body;



    const existingDepartment = await Department.findOne({
        code
    });



    if(existingDepartment){

        throw new ApiError(
            400,
            "Department already exists"
        );

    }



    const department = await Department.create({

        name,
        code,
        description,
        hod

    });



    res.status(201).json(

        new ApiResponse(
            201,
            "Department created successfully",
            department
        )

    );


});




// Get All Departments
const getAllDepartments = asyncHandler(async (req, res) => {


    const features = new APIFeatures(

        Department.find()
        .populate(
            "hod",
            "name email role"
        ),

        req.query

    )
    .filter()
    .search(["name", "code"])
    .sort()
    .limitFields()
    .paginate();



    const departments = await features.query;



    res.status(200).json(

        new ApiResponse(

            200,

            "Departments fetched successfully",

            departments,

            departments.length

        )

    );


});



module.exports = {

    createDepartment,
    getAllDepartments

};