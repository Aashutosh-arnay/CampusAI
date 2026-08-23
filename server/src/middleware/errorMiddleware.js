const logger = require("../utils/logger");
const errorMiddleware = (err, req, res, next) => {

    // Invalid MongoDB ObjectId
    if (err.name === "CastError") {
        return res.status(400).json({
            success: false,
            status: "fail",
            message: "Invalid ID"
        });
    }

    // Duplicate Key Error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];

        return res.status(400).json({
            success: false,
            status: "fail",
            message: `${field} already exists`
        });
    }

    // Mongoose Validation Error
    if (err.name === "ValidationError") {

        const errors = Object.values(err.errors).map(error => ({
            field: error.path,
            message: error.message
        }));

        return res.status(400).json({
            success: false,
            status: "fail",
            message: "Validation failed",
            errors
        });
    }

    const statusCode = err.statusCode || 500;
    const status = err.status || "error";

    if (!err.isOperational) {
        logger.error("Unexpected application error", {
            error: err.message,
            stack: err.stack
        });
        const statusCode =
            err.statusCode && err.statusCode >= 400 && err.statusCode < 500
                ? err.statusCode
                : 500;

        return res.status(statusCode).json({
            success: false,
            statusCode,
            status: statusCode >= 500 ? "error" : "fail",
            message:
                statusCode === 400
                    ? "Invalid request"
                    : "Internal Server Error"
        });
    }

    return res.status(statusCode).json({
        success: false,
        statusCode,
        status,
        message: err.message || "An error occurred"
    });
};

module.exports = errorMiddleware;