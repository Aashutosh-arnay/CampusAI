const Student = require("../models/Student");


const createStudentProfile = async (req, res) => {

    try {

        console.log(req.body);

        const {
            rollNumber,
            department,
            semester,
            skills,
            cgpa,
            phone
        } = req.body;


        const student = await Student.create({

            user: req.user.id,

            rollNumber,
            department,
            semester,
            skills,
            cgpa,
            phone

        });


        res.status(201).json({
            message: "Student profile created successfully",
            student
        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
const getStudentProfile = async (req, res) => {

    try {

        const student = await Student.findOne({
        user: req.user.id
        })
        .populate("user", "name email role -_id")
        .populate("department", "name code -_id")


        if (!student) {
            return res.status(404).json({
                message: "Student profile not found"
            });
        }


        res.status(200).json({
            student
        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
const updateStudentProfile = async (req, res) => {

    try {

        const student = await Student.findOneAndUpdate(
            {
                user: req.user.id
            },
            req.body,
            {
                new: true
            }
        );


        if (!student) {
            return res.status(404).json({
                message: "Student profile not found"
            });
        }


        res.status(200).json({
            message: "Student profile updated successfully",
            student
        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
const deleteStudentProfile = async (req, res) => {

    try {

        const student = await Student.findOneAndDelete({
            user: req.user.id
        });


        if (!student) {
            return res.status(404).json({
                message: "Student profile not found"
            });
        }


        res.status(200).json({
            message: "Student profile deleted successfully"
        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


module.exports = {
    createStudentProfile,
    getStudentProfile,
    updateStudentProfile,
    deleteStudentProfile 
};
