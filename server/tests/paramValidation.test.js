const { validationResult } = require("express-validator");
const { mongoIdParam } = require("../src/validations/paramValidation");

describe("Mongo ID Parameter Validation", () => {

    test("should accept a valid MongoDB ObjectId", async () => {

        const req = {
            params: {
                id: "507f1f77bcf86cd799439011"
            }
        };

        const res = {};
        const next = jest.fn();

        const middleware = mongoIdParam("id", "ID");

        for (const validator of middleware) {
            await validator.run(req, res, next);
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(true);

    });

    test("should reject an invalid MongoDB ObjectId", async () => {

        const req = {
            params: {
                id: "invalid-id"
            }
        };

        const res = {};
        const next = jest.fn();

        const middleware = mongoIdParam("id", "ID");

        for (const validator of middleware) {
            await validator.run(req, res, next);
        }

        const errors = validationResult(req);

        expect(errors.isEmpty()).toBe(false);

        expect(errors.array()[0].msg).toBe("Invalid ID");

    });

});