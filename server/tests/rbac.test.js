jest.mock("sanitize-html", () => {
    return (value) => value;
});

const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/app");

process.env.JWT_SECRET = "test-secret";

describe("RBAC", () => {

    test("should reject unauthenticated access", async () => {
        const response = await request(app)
            .post("/api/courses")
            .send({});

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe("No token provided");
    });

    test("should reject non-admin user from admin-only course creation", async () => {
        const token = jwt.sign(
            {
                id: "test-user-id",
                role: "student"
            },
            process.env.JWT_SECRET
        );

        const response = await request(app)
            .post("/api/courses")
            .set("Authorization", `Bearer ${token}`)
            .send({});

        expect(response.statusCode).toBe(403);
        expect(response.body.message).toBe("Access denied");
    });
});