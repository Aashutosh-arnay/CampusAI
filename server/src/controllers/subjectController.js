const Subject = require("../models/Subject");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

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

    // Check duplicate subject code
    const existingSubject = await Subject.findOne({ code });

    if (existingSubject) {
        throw new AppError("Subject already exists", 400);
    }

    const subject = await Subject.create({
        name,
        code,
        course,
        semester,
        credits,
        description
    });

    res.status(201).json({
        success: true,
        message: "Subject created successfully",
        data: subject
    });

});
// Get All Subjects
const getAllSubjects = asyncHandler(async (req, res) => {

    const subjects = await Subject.find()
        .populate("course", "name code -_id");

    res.status(200).json({
        success: true,
        totalSubjects: subjects.length,
        data: subjects
    });

});
// Get Subject By ID
const getSubjectById = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const subject = await Subject.findById(id)
        .populate("course", "name code -_id");

    if (!subject) {
        throw new AppError("Subject not found", 404);
    }

    res.status(200).json({
        success: true,
        data: subject
    });

});
// Update Subject
const updateSubject = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const subject = await Subject.findById(id);

    if (!subject) {
        throw new AppError("Subject not found", 404);
    }

    // Check if another subject already uses the same code
    if (req.body.code) {

        const existingSubject = await Subject.findOne({
            code: req.body.code,
            _id: { $ne: id }
        });

        if (existingSubject) {
            throw new AppError("Subject code already exists", 400);
        }
    }

    const updatedSubject = await Subject.findByIdAndUpdate(
        id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    ).populate("course", "name code -_id");

    res.status(200).json({
        success: true,
        message: "Subject updated successfully",
        data: updatedSubject
    });

});

// Delete Subject
const deleteSubject = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const subject = await Subject.findById(id);

    if (!subject) {
        throw new AppError("Subject not found", 404);
    }

    await Subject.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: "Subject deleted successfully"
    });

});
module.exports = {
    createSubject,
    getAllSubjects,
    getSubjectById,
    updateSubject,
    deleteSubject
};