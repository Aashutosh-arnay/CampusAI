jest.mock("sanitize-html", () => {
    return (value) => value;
});

const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/app");

const studentToken = jwt.sign(
    {
        id: "test-student-id",
        role: "student"
    },
    process.env.JWT_SECRET
);

describe("Enrollment Validation", () => {

    test("should reject missing student ID", async () => {
        const response = await request(app)
            .post("/api/enrollments")
            .set("Authorization", `Bearer ${studentToken}`)
            .send({
                subject: "507f1f77bcf86cd799439011",
                academicYear: "2026-27",
                semester: 3,
                section: "A"
            });

        expect(response.statusCode).toBe(400);
    });

    test("should reject invalid student ID", async () => {
        const response = await request(app)
            .post("/api/enrollments")
            .set("Authorization", `Bearer ${studentToken}`)
            .send({
                student: "invalid-id",
                subject: "507f1f77bcf86cd799439011",
                academicYear: "2026-27",
                semester: 3,
                section: "A"
            });

        expect(response.statusCode).toBe(400);
    });

    test("should reject invalid subject ID", async () => {
        const response = await request(app)
            .post("/api/enrollments")
            .set("Authorization", `Bearer ${studentToken}`)
            .send({
                student: "507f1f77bcf86cd799439011",
                subject: "invalid-id",
                academicYear: "2026-27",
                semester: 3,
                section: "A"
            });

        expect(response.statusCode).toBe(400);
    });

    test("should reject invalid semester", async () => {
        const response = await request(app)
            .post("/api/enrollments")
            .set("Authorization", `Bearer ${studentToken}`)
            .send({
                student: "507f1f77bcf86cd799439011",
                subject: "507f1f77bcf86cd799439011",
                academicYear: "2026-27",
                semester: 9,
                section: "A"
            });

        expect(response.statusCode).toBe(400);
    });

    test("should reject missing academic year", async () => {
        const response = await request(app)
            .post("/api/enrollments")
            .set("Authorization", `Bearer ${studentToken}`)
            .send({
                student: "507f1f77bcf86cd799439011",
                subject: "507f1f77bcf86cd799439011",
                semester: 3,
                section: "A"
            });

        expect(response.statusCode).toBe(400);
    });

    test("should reject missing section", async () => {
        const response = await request(app)
            .post("/api/enrollments")
            .set("Authorization", `Bearer ${studentToken}`)
            .send({
                student: "507f1f77bcf86cd799439011",
                subject: "507f1f77bcf86cd799439011",
                academicYear: "2026-27",
                semester: 3
            });

        expect(response.statusCode).toBe(400);
    });

});