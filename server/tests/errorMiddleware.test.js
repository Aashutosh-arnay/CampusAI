const errorMiddleware = require("../src/middleware/errorMiddleware");
const logger = require("../src/utils/logger");

jest.mock("../src/utils/logger", () => ({
    error: jest.fn()
}));

describe("Error Middleware", () => {

    let req;
    let res;
    let next;

    beforeEach(() => {

        jest.clearAllMocks();

        req = {
            method: "GET",
            originalUrl: "/api/test"
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };

        next = jest.fn();

    });

    test("should handle CastError as 400", () => {

        const error = {
            name: "CastError",
            message: "Invalid ObjectId"
        };

        errorMiddleware(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            status: "fail",
            message: "Invalid ID"
        });

    });

    test("should handle duplicate key error as 400", () => {

        const error = {
            code: 11000,
            keyValue: {
                email: "test@example.com"
            }
        };

        errorMiddleware(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            status: "fail",
            message: "email already exists"
        });

    });

    test("should handle Mongoose ValidationError as 400", () => {

        const error = {
            name: "ValidationError",
            errors: {
                email: {
                    path: "email",
                    message: "Invalid email"
                }
            }
        };

        errorMiddleware(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            status: "fail",
            message: "Validation failed",
            errors: [
                {
                    field: "email",
                    message: "Invalid email"
                }
            ]
        });

    });

    test("should return operational AppError without logging as unexpected", () => {

        const error = {
            statusCode: 404,
            status: "fail",
            message: "Student not found",
            isOperational: true
        };

        errorMiddleware(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            statusCode: 404,
            status: "fail",
            message: "Student not found"
        });

        expect(logger.error).not.toHaveBeenCalled();

    });

    test("should log unexpected errors and return generic 500 response", () => {

        const error = new Error("Database connection failed");

        error.isOperational = false;

        error.stack = "test-stack";

        errorMiddleware(error, req, res, next);

        expect(logger.error).toHaveBeenCalledWith(
            "Unexpected application error",
            {
                error: "Database connection failed",
                stack: "test-stack"
            }
        );

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            statusCode: 500,
            status: "error",
            message: "Internal Server Error"
        });

    });

});