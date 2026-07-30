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

    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    res.status(err.statusCode).json({
        success: false,
        status: err.status,
        message: err.message || "Internal Server Error"
    });

};

module.exports = errorMiddleware;