const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true
        },

        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            required: true
        },

        duration: {
            type: Number,
            required: true
        },

        description: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Course", courseSchema);