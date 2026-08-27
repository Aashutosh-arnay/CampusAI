const { validateEnv } = require("../src/config/env");

describe("Environment Configuration Security", () => {

    const originalJwtSecret = process.env.JWT_SECRET;
    const originalMongoUri = process.env.MONGODB_URI;

    afterEach(() => {
        process.env.JWT_SECRET = originalJwtSecret;
        process.env.MONGODB_URI = originalMongoUri;
    });

    test("should pass when required environment variables exist", () => {

        process.env.JWT_SECRET = "test-secret";
        process.env.MONGODB_URI = "mongodb://localhost:27017/test";

        expect(() => validateEnv()).not.toThrow();

    });

    test("should reject missing JWT_SECRET", () => {

        delete process.env.JWT_SECRET;
        process.env.MONGODB_URI = "mongodb://localhost:27017/test";

        expect(() => validateEnv()).toThrow(
            "Missing required environment variable(s): JWT_SECRET"
        );

    });

    test("should reject missing MONGODB_URI", () => {
        delete process.env.MONGODB_URI;

        expect(() => validateEnv()).toThrow(
            "Missing required environment variable(s): MONGODB_URI"
        );

    });

    test("should reject multiple missing required variables", () => {

        delete process.env.JWT_SECRET;
        delete process.env.MONGODB_URI;

        expect(() => validateEnv()).toThrow(
            "Missing required environment variable(s): JWT_SECRET, MONGODB_URI"
        );

    });

});