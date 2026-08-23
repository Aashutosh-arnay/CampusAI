const Subject = require("../models/Subject");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/AppError");
const APIFeatures = require("../utils/apiFeatures");
const ApiResponse = require("../utils/apiResponse");


// Create Subject
const createSubject = asyncHandler(async (req, res) => {

    const {
        name,
        code,
        course,
        semester,
        credits,
        description
    } = req.body;

    const existingSubject = await Subject.findOne({ code });

    if (existingSubject) {
        throw new ApiError(
            400,
            "Subject already exists",
            
        );
    }

    const subject = await Subject.create({
        name,
        code,
        course,
        semester,
        credits,
        description
    });

    res.status(201).json(
        new ApiResponse(
            201,
            "Subject created successfully",
            subject
        )
    );

});

// Get All Subjects
const getAllSubjects = asyncHandler(async (req, res) => {

    const features = new APIFeatures(
        Subject.find()
            .populate("course", "name code -_id"),
        req.query
    )
    .filter()
    .search(["name", "code"])
    .sort()
    .limitFields()
    .paginate();

    const subjects = await features.query;

    res.status(200).json(
        new ApiResponse(
            200,
            "Subjects fetched successfully",
            subjects,
            subjects.length
        )
    );

});
// Get Subject By ID
const getSubjectById = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const subject = await Subject.findById(id)
        .populate("course", "name code -_id");

    if (!subject) {
        throw new ApiError(
            404,
            "Subject not found"
        );
    }

    res.status(200).json(
        new ApiResponse(
            200,
            "Subject fetched successfully",
            subject
        )
    );

});
// Update Subject
const updateSubject = asyncHandler(async (req, res) => {

    const { id } = req.params;

    // Check duplicate subject code
    if (req.body.code) {

        const existingSubject = await Subject.findOne({
            code: req.body.code,
            _id: { $ne: id }
        });

        if (existingSubject) {
            throw new ApiError(
                400,
                "Subject code already exists"
            );
        }
    }

    const updatedSubject = await Subject.findByIdAndUpdate(
        id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    ).populate(
        "course",
        "name code -_id"
    );

    if (!updatedSubject) {
        throw new ApiError(
            404,
            "Subject not found"
        );
    }

    res.status(200).json(
        new ApiResponse(
            200,
            "Subject updated successfully",
            updatedSubject
        )
    );

});


// Delete Subject
const deleteSubject = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const deletedSubject = await Subject.findByIdAndDelete(id);

    if (!deletedSubject) {
        throw new ApiError(
            404,
            "Subject not found"
        );
    }

    res.status(200).json(
        new ApiResponse(
            200,
            "Subject deleted successfully",
            null
        )
    );

});

module.exports = {
    createSubject,
    getAllSubjects,
    getSubjectById,
    updateSubject,
    deleteSubject
};