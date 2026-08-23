jest.mock("sanitize-html", () => {
    return (value) => value;
});

const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/app");

process.env.JWT_SECRET = "test-secret";

const facultyToken = jwt.sign(
    {
        id: "test-faculty-id",
        role: "faculty"
    },
    process.env.JWT_SECRET
);

describe("Attendance Validation", () => {

    test("should reject missing enrollment ID", async () => {
        const response = await request(app)
            .post("/api/attendance")
            .set("Authorization", `Bearer ${facultyToken}`)
            .send({
                facultyAssignment: "507f1f77bcf86cd799439011",
                date: "2026-08-20T09:00:00.000Z",
                status: "Present"
            });

        expect(response.statusCode).toBe(400);
    });

    test("should reject invalid enrollment ID", async () => {
        const response = await request(app)
            .post("/api/attendance")
            .set("Authorization", `Bearer ${facultyToken}`)
            .send({
                enrollment: "invalid-id",
                facultyAssignment: "507f1f77bcf86cd799439011",
                date: "2026-08-20T09:00:00.000Z",
                status: "Present"
            });

        expect(response.statusCode).toBe(400);
    });

    test("should reject invalid faculty assignment ID", async () => {
        const response = await request(app)
            .post("/api/attendance")
            .set("Authorization", `Bearer ${facultyToken}`)
            .send({
                enrollment: "507f1f77bcf86cd799439011",
                facultyAssignment: "invalid-id",
                date: "2026-08-20T09:00:00.000Z",
                status: "Present"
            });

        expect(response.statusCode).toBe(400);
    });

    test("should reject invalid date", async () => {
        const response = await request(app)
            .post("/api/attendance")
            .set("Authorization", `Bearer ${facultyToken}`)
            .send({
                enrollment: "507f1f77bcf86cd799439011",
                facultyAssignment: "507f1f77bcf86cd799439011",
                date: "invalid-date",
                status: "Present"
            });

        expect(response.statusCode).toBe(400);
    });

    test("should reject invalid attendance status", async () => {
        const response = await request(app)
            .post("/api/attendance")
            .set("Authorization", `Bearer ${facultyToken}`)
            .send({
                enrollment: "507f1f77bcf86cd799439011",
                facultyAssignment: "507f1f77bcf86cd799439011",
                date: "2026-08-20T09:00:00.000Z",
                status: "Invalid"
            });

        expect(response.statusCode).toBe(400);
    });

});