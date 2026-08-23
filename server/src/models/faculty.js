const mongoose = require("mongoose");


const facultySchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    employeeId: {
        type: String,
        required: true,
        unique: true
    },

        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            required: true
        },
    designation: {
        type: String,
        required: true
    },

    phone: {
        type: String
    }

},
{
    timestamps: true
});


module.exports = mongoose.model("Faculty", facultySchema);