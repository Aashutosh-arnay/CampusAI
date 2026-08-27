jest.mock("sanitize-html", () => {
    return (value) => value;
});

jest.mock("../src/models/User", () => ({
    findOne: jest.fn(),
    create: jest.fn()
}));

const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");

describe("Authentication APIs", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("POST /api/auth/register should reject invalid email", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Test User",
                email: "invalid-email",
                password: "password123",
                role: "student"
            });

        expect(response.statusCode).toBe(400);
        expect(User.findOne).not.toHaveBeenCalled();
    });

    test("POST /api/auth/register should reject short password", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Test User",
                email: "test@example.com",
                password: "123",
                role: "student"
            });

        expect(response.statusCode).toBe(400);
        expect(User.findOne).not.toHaveBeenCalled();
    });

    test("POST /api/auth/login should reject invalid email", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "invalid-email",
                password: "password123"
            });

        expect(response.statusCode).toBe(400);
    });

    test("POST /api/auth/login should reject missing password", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "test@example.com"
            });

        expect(response.statusCode).toBe(400);
    });

    test("POST /api/auth/register should reject admin role", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Test Admin",
                email: "admin@example.com",
                password: "password123",
                role: "admin"
            });

        expect(response.statusCode).toBe(400);
        expect(User.findOne).not.toHaveBeenCalled();
    });

    test("POST /api/auth/register should reject faculty role", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Test Faculty",
                email: "faculty@example.com",
                password: "password123",
                role: "faculty"
            });

        expect(response.statusCode).toBe(400);
        expect(User.findOne).not.toHaveBeenCalled();
    });

   
});