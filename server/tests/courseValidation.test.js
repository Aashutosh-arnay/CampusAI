jest.mock("sanitize-html", () => {
    return (value) => value;
});

const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/app");

process.env.JWT_SECRET = "test-secret";

const adminToken = jwt.sign(
    {
        id: "test-admin-id",
        role: "admin"
    },
    process.env.JWT_SECRET
);

describe("Course Validation", () => {

    test("should reject missing course name", async () => {
        const response = await request(app)
            .post("/api/courses")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                code: "BTECH",
                department: "507f1f77bcf86cd799439011",
                duration: 4
            });

        expect(response.statusCode).toBe(400);
    });

    test("should reject missing course code", async () => {
        const response = await request(app)
            .post("/api/courses")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "Bachelor of Technology",
                department: "507f1f77bcf86cd799439011",
                duration: 4
            });

        expect(response.statusCode).toBe(400);
    });

    test("should reject invalid department ID", async () => {
        const response = await request(app)
            .post("/api/courses")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "Bachelor of Technology",
                code: "BTECH",
                department: "invalid-id",
                duration: 4
            });

        expect(response.statusCode).toBe(400);
    });

    test("should reject invalid duration", async () => {
        const response = await request(app)
            .post("/api/courses")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "Bachelor of Technology",
                code: "BTECH",
                department: "507f1f77bcf86cd799439011",
                duration: 0
            });

        expect(response.statusCode).toBe(400);
    });

});