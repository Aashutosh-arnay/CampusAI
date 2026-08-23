jest.mock("sanitize-html", () => {
    return (value) => value;
});

const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/app");

process.env.JWT_SECRET = "test-secret";

const studentToken = jwt.sign(
    {
        id: "test-student-id",
        role: "student"
    },
    process.env.JWT_SECRET
);

describe("Student Validation", () => {

    test("should reject missing rollNumber", async () => {
        const response = await request(app)
            .post("/api/student/profile")
            .set("Authorization", `Bearer ${studentToken}`)
            .send({
                department: "department-id",
                course: "course-id",
                section: "A",
                semester: 5
            });

        expect(response.statusCode).toBe(400);
    });

    test("should reject missing department", async () => {
        const response = await request(app)
            .post("/api/student/profile")
            .set("Authorization", `Bearer ${studentToken}`)
            .send({
                rollNumber: "CSE2026001",
                course: "course-id",
                section: "A",
                semester: 5
            });

        expect(response.statusCode).toBe(400);
    });

    test("should reject invalid semester", async () => {
        const response = await request(app)
            .post("/api/student/profile")
            .set("Authorization", `Bearer ${studentToken}`)
            .send({
                rollNumber: "CSE2026001",
                department: "department-id",
                course: "course-id",
                section: "A",
                semester: 9
            });

        expect(response.statusCode).toBe(400);
    });

    test("should reject non-integer semester", async () => {
        const response = await request(app)
            .post("/api/student/profile")
            .set("Authorization", `Bearer ${studentToken}`)
            .send({
                rollNumber: "CSE2026001",
                department: "department-id",
                course: "course-id",
                section: "A",
                semester: "fifth"
            });

        expect(response.statusCode).toBe(400);
    });

});