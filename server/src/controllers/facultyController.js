const Faculty = require("../models/Faculty");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/AppError");
const ApiResponse = require("../utils/apiResponse");


// Get Faculty Profile
const getFacultyProfile = asyncHandler(async (req, res) => {


    const faculty = await Faculty.findOne({

        user: req.user.id

    })
    .populate("user", "name email role")
    .populate("department", "name code -_id");


    if (!faculty) {

        throw new ApiError(
            404,
            "Faculty profile not found"
        );

    }


    res.status(200).json(

        new ApiResponse(
            200,
            "Faculty profile fetched successfully",
            faculty
        )

    );

});


// Update Faculty Profile
const updateFacultyProfile = asyncHandler(async (req, res) => {


    const faculty = await Faculty.findOneAndUpdate(

        {
            user: req.user.id
        },

        req.body,

        {
            new:true,
            runValidators:true
        }

    );


    if (!faculty) {

        throw new ApiError(
            404,
            "Faculty profile not found"
        );

    }


    res.status(200).json(

        new ApiResponse(
            200,
            "Faculty profile updated successfully",
            faculty
        )

    );


});


module.exports = {

    getFacultyProfile,
    updateFacultyProfile

};