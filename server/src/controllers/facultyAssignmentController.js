const FacultyAssignment = require("../models/FacultyAssignment");
const Faculty = require("../models/Faculty");
const Subject = require("../models/Subject");

const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/AppError");
const APIFeatures = require("../utils/apiFeatures");
const ApiResponse = require("../utils/apiResponse");


// Assign Faculty to Subject
const assignFaculty = asyncHandler(async (req, res) => {

    const {
        faculty,
        subject,
        academicYear,
        semester,
        section
    } = req.body;

    const facultyExists = await Faculty.findById(faculty);

    if (!facultyExists) {

        throw new ApiError(
            404,
            "Faculty not found"
        );

    }

    const subjectExists = await Subject.findById(subject);

    if (!subjectExists) {

        throw new ApiError(
            404,
            "Subject not found"
        );

    }

    const existingAssignment = await FacultyAssignment.findOne({

        faculty,
        subject,
        academicYear,
        semester,
        section

    });

    if (existingAssignment) {

        throw new ApiError(
            400,
            "Faculty is already assigned to this subject"
        );

    }

    const assignment = await FacultyAssignment.create({

        faculty,
        subject,
        academicYear,
        semester,
        section

    });

    res.status(201).json(

        new ApiResponse(
            201,
            "Faculty assigned successfully",
            assignment
        )

    );

});


// Get All Assignments
const getAllAssignments = asyncHandler(async (req, res) => {

    const features = new APIFeatures(

        FacultyAssignment.find()

            .populate({
                path: "faculty",
                select: "employeeId designation",
                populate: {
                    path: "user",
                    select: "name email"
                }
            })

            .populate({
                path: "subject",
                select: "name code semester"
            }),

        req.query

    )
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const assignments = await features.query;

    res.status(200).json(

        new ApiResponse(
            200,
            "Faculty assignments fetched successfully",
            assignments,
            assignments.length
        )

    );

});


// Get Assignment By ID
const getAssignmentById = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const assignment = await FacultyAssignment.findById(id)

        .populate({
            path: "faculty",
            select: "employeeId designation",
            populate: {
                path: "user",
                select: "name email"
            }
        })

        .populate({
            path: "subject",
            select: "name code semester credits"
        });

    if (!assignment) {

        throw new ApiError(
            404,
            "Assignment not found"
        );

    }

    res.status(200).json(

        new ApiResponse(
            200,
            "Assignment fetched successfully",
            assignment
        )

    );

});


// Update Assignment
const updateAssignment = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const assignment = await FacultyAssignment.findById(id);

    if (!assignment) {

        throw new ApiError(
            404,
            "Assignment not found"
        );

    }

    // Values after update
    const faculty = req.body.faculty ?? assignment.faculty;
    const subject = req.body.subject ?? assignment.subject;
    const academicYear =
        req.body.academicYear ?? assignment.academicYear;
    const semester =
        req.body.semester ?? assignment.semester;
    const section =
        req.body.section ?? assignment.section;

    // Check faculty exists
    if (req.body.faculty) {

        const facultyExists = await Faculty.findById(
            req.body.faculty
        );

        if (!facultyExists) {

            throw new ApiError(
                404,
                "Faculty not found"
            );

        }

    }

    // Check subject exists
    if (req.body.subject) {

        const subjectExists = await Subject.findById(
            req.body.subject
        );

        if (!subjectExists) {

            throw new ApiError(
                404,
                "Subject not found"
            );

        }

    }

    // Check for duplicate assignment
    const existingAssignment =
        await FacultyAssignment.findOne({

            faculty,
            subject,
            academicYear,
            semester,
            section,

            _id: {
                $ne: id
            }

        });

    if (existingAssignment) {

        throw new ApiError(
            400,
            "Faculty is already assigned to this subject"
        );

    }

    const updatedAssignment =
        await FacultyAssignment.findByIdAndUpdate(

            id,
            req.body,

            {
                new: true,
                runValidators: true
            }

        )
            .populate({
                path: "faculty",
                select: "employeeId designation",
                populate: {
                    path: "user",
                    select: "name email"
                }
            })
            .populate({
                path: "subject",
                select: "name code semester credits"
            });

    res.status(200).json(

        new ApiResponse(
            200,
            "Assignment updated successfully",
            updatedAssignment
        )

    );

});


// Delete Assignment
const deleteAssignment = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const assignment =
        await FacultyAssignment.findById(id);

    if (!assignment) {

        throw new ApiError(
            404,
            "Assignment not found"
        );

    }

    await FacultyAssignment.findByIdAndDelete(id);

    res.status(200).json(

        new ApiResponse(
            200,
            "Assignment deleted successfully",
            null
        )

    );

});


module.exports = {

    assignFaculty,
    getAllAssignments,
    getAssignmentById,
    updateAssignment,
    deleteAssignment

};