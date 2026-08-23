const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/AppError");
const ApiResponse = require("../utils/apiResponse");

// REGISTER API
const registerUser = asyncHandler(async (req, res) => {

    const {
        name,
        email,
        password,
        role
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(
            400,
            "User already exists"
           
        );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
        password,
        10
    );

    // Create User
    const user = await User.create({

        name,
        email,
        password: hashedPassword,
        role

    });

    res.status(201).json(

        new ApiResponse(

            201,

            "User registered successfully",

            {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }

        )

    );

});


// LOGIN API
const loginUser = asyncHandler(async (req, res) => {

    const {
        email,
        password
    } = req.body;

    // Find User
    const user = await User.findOne({ email }).select("+password");

    if (!user) {

        throw new ApiError(
            404,
            "User not found"
            
        );

    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordCorrect) {

        throw new ApiError(
            400,
            "Invalid password"
            
        );

    }

    // Generate JWT
    const token = jwt.sign(

        {
            id: user._id,
            role: user.role
        },

        process.env.JWT_SECRET,

        {
            expiresIn: "1d"
        }

    );

    res.status(200).json(

        new ApiResponse(

            200,

            "Login successful",

            {
                token,

                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }

        )

    );

});


module.exports = {
    registerUser,
    loginUser
};