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

describe("Subject Validation", () => {

    test("should reject missing subject name", async () => {
        const response = await request(app)
            .post("/api/subjects")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                code: "DS101",
                course: "507f1f77bcf86cd799439011",
                semester: 3,
                credits: 4
            });

        expect(response.statusCode).toBe(400);
    });

    test("should reject missing subject code", async () => {
        const response = await request(app)
            .post("/api/subjects")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "Data Structures",
                course: "507f1f77bcf86cd799439011",
                semester: 3,
                credits: 4
            });

        expect(response.statusCode).toBe(400);
    });

    test("should reject invalid course ID", async () => {
        const response = await request(app)
            .post("/api/subjects")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "Data Structures",
                code: "DS101",
                course: "invalid-id",
                semester: 3,
                credits: 4
            });

        expect(response.statusCode).toBe(400);
    });

    test("should reject invalid semester", async () => {
        const response = await request(app)
            .post("/api/subjects")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "Data Structures",
                code: "DS101",
                course: "507f1f77bcf86cd799439011",
                semester: 9,
                credits: 4
            });

        expect(response.statusCode).toBe(400);
    });

    test("should reject invalid credits", async () => {
        const response = await request(app)
            .post("/api/subjects")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "Data Structures",
                code: "DS101",
                course: "507f1f77bcf86cd799439011",
                semester: 3,
                credits: 0
            });

        expect(response.statusCode).toBe(400);
    });

});