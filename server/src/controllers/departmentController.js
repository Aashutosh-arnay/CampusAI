const Department = require("../models/Department");


// Create Department
const createDepartment = async (req, res) => {

    try {

        const { name, code, description, hod } = req.body;


        const existingDepartment = await Department.findOne({
            code
        });


        if (existingDepartment) {
            return res.status(400).json({
                message: "Department already exists"
            });
        }


        const department = await Department.create({
            name,
            code,
            description,
            hod
        });


        res.status(201).json({
            message: "Department created successfully",
            department
        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};



// Get All Departments
const getAllDepartments = async (req, res) => {

    try {

        const departments = await Department.find()
            .populate("hod", "name email role");


        res.status(200).json({
            departments
        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};



module.exports = {
    createDepartment,
    getAllDepartments
};