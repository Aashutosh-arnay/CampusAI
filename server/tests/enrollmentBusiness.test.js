jest.mock("sanitize-html", () => {
    return (value) => value;
});

const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const app = require("../src/app");

const User = require("../src/models/User");
const Department = require("../src/models/Department");
const Course = require("../src/models/Course");
const Subject = require("../src/models/Subject");
const Student = require("../src/models/Student");
const Enrollment = require("../src/models/Enrollment");

const {
    connectTestDB,
    closeTestDB,
    clearTestDB
} = require("./setup");

process.env.JWT_SECRET = "test-secret";

const studentToken = jwt.sign(
    {
        id: new mongoose.Types.ObjectId().toString(),
        role: "student"
    },
    process.env.JWT_SECRET
);

describe("Enrollment Business Rules", () => {

    let department;
    let course;
    let subject;
    let user;
    let student;

    beforeAll(async () => {
        await connectTestDB();
    });

    beforeEach(async () => {
        await clearTestDB();

        department = await Department.create({
            name: "Computer Science Engineering",
            code: "CSE"
        });

        course = await Course.create({
            name: "Bachelor of Technology",
            code: "BTECH",
            department: department._id,
            duration: 4
        });

        subject = await Subject.create({
            name: "Data Structures",
            code: "DS101",
            course: course._id,
            semester: 3,
            credits: 4
        });

        user = await User.create({
            name: "Test Student",
            email: "student@test.com",
            password: "password123",
            role: "student"
        });

        student = await Student.create({
            user: user._id,
            rollNumber: "CSE2026001",
            department: department._id,
            course: course._id,
            section: "A",
            semester: 3
        });
    });

    afterAll(async () => {
        await closeTestDB();
    });

    test("should reject duplicate enrollment", async () => {

        const enrollmentData = {
            student: student._id.toString(),
            subject: subject._id.toString(),
            academicYear: "2026-27",
            semester: 3,
            section: "A"
        };

        const firstResponse = await request(app)
            .post("/api/enrollments")
            .set("Authorization", `Bearer ${studentToken}`)
            .send(enrollmentData);

        expect(firstResponse.statusCode).toBe(201);

        const secondResponse = await request(app)
            .post("/api/enrollments")
            .set("Authorization", `Bearer ${studentToken}`)
            .send(enrollmentData);

        expect(secondResponse.statusCode).toBe(400);

        expect(secondResponse.body.message).toBe(
            "Student already enrolled in this subject"
        );

        const enrollments = await Enrollment.find({
            student: student._id,
            subject: subject._id
        });

        expect(enrollments.length).toBe(1);
    });
});