jest.mock("sanitize-html", () => {
    return (value) => value;
});

const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/app");

const facultyToken = jwt.sign(
    {
        id: "test-faculty-id",
        role: "faculty"
    },
    process.env.JWT_SECRET
);

describe("Marks Validation", () => {

    test("should reject invalid student ID", async () => {
        const response = await request(app)
            .post("/api/marks")
            .set("Authorization", `Bearer ${facultyToken}`)
            .send({
                student: "invalid-id",
                subject: "507f1f77bcf86cd799439011",
                facultyAssignment: "507f1f77bcf86cd799439011",
                marksObtained: 80,
                totalMarks: 100,
                examType: "Midterm"
            });

        expect(response.statusCode).toBe(400);
    });

    test("should reject negative marks", async () => {
        const response = await request(app)
            .post("/api/marks")
            .set("Authorization", `Bearer ${facultyToken}`)
            .send({
                student: "507f1f77bcf86cd799439011",
                subject: "507f1f77bcf86cd799439011",
                facultyAssignment: "507f1f77bcf86cd799439011",
                marksObtained: -5,
                totalMarks: 100,
                examType: "Midterm"
            });

        expect(response.statusCode).toBe(400);
    });

    test("should reject invalid total marks", async () => {
        const response = await request(app)
            .post("/api/marks")
            .set("Authorization", `Bearer ${facultyToken}`)
            .send({
                student: "507f1f77bcf86cd799439011",
                subject: "507f1f77bcf86cd799439011",
                facultyAssignment: "507f1f77bcf86cd799439011",
                marksObtained: 50,
                totalMarks: 0,
                examType: "Midterm"
            });

        expect(response.statusCode).toBe(400);
    });

    test("should reject invalid exam type", async () => {
        const response = await request(app)
            .post("/api/marks")
            .set("Authorization", `Bearer ${facultyToken}`)
            .send({
                student: "507f1f77bcf86cd799439011",
                subject: "507f1f77bcf86cd799439011",
                facultyAssignment: "507f1f77bcf86cd799439011",
                marksObtained: 50,
                totalMarks: 100,
                examType: "FinalExam"
            });

        expect(response.statusCode).toBe(400);
    });

    test("should reject invalid faculty assignment ID", async () => {
        const response = await request(app)
            .post("/api/marks")
            .set("Authorization", `Bearer ${facultyToken}`)
            .send({
                student: "507f1f77bcf86cd799439011",
                subject: "507f1f77bcf86cd799439011",
                facultyAssignment: "invalid-id",
                marksObtained: 50,
                totalMarks: 100,
                examType: "Midterm"
            });

        expect(response.statusCode).toBe(400);
    });
});