const Faculty = require("../models/Faculty");


const getFacultyProfile = async (req, res) => {

    try {

        const faculty = await Faculty.findOne({
            user: req.user.id
        }).populate("user", "name email role");


        if (!faculty) {
            return res.status(404).json({
                message: "Faculty profile not found"
            });
        }


        res.status(200).json({
            faculty
        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
const updateFacultyProfile = async (req, res) => {

    try {

        const faculty = await Faculty.findOneAndUpdate(
            {
                user: req.user.id
            },
            req.body,
            {
                new: true
            }
        );


        if (!faculty) {
            return res.status(404).json({
                message: "Faculty profile not found"
            });
        }


        res.status(200).json({
            message: "Faculty profile updated successfully",
            faculty
        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


module.exports = {
    getFacultyProfile,
    updateFacultyProfile
};