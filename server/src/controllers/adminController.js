const Student = require("../models/Student");
const Faculty = require("../models/Faculty");
const User = require("../models/User");

const getAllStudents = async (req, res) => {

    try {

        const students = await Student.find()
            .populate("user", "name email role");


        res.status(200).json({
            students
        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const getAllFaculty = async (req, res) => {

    try {

        const faculty = await Faculty.find()
            .populate("user", "name email role");


        res.status(200).json({
            faculty
        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
const deleteStudent = async (req, res) => {

    try {

        const student = await Student.findById(req.params.id);


        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }


        await User.findByIdAndDelete(student.user);

        await Student.findByIdAndDelete(req.params.id);


        res.status(200).json({
            message: "Student deleted successfully"
        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
const deleteFaculty = async (req, res) => {

    try {

        const faculty = await Faculty.findById(req.params.id);


        if (!faculty) {
            return res.status(404).json({
                message: "Faculty not found"
            });
        }


        await User.findByIdAndDelete(faculty.user);

        await Faculty.findByIdAndDelete(req.params.id);


        res.status(200).json({
            message: "Faculty deleted successfully"
        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


module.exports = {
    getAllStudents,
    getAllFaculty,
    deleteStudent,
    deleteFaculty 

};