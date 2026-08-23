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

describe("Enrollment CRUD", () => {

    let department;
    let course;
    let subject;
    let user;
    let student;
    let enrollment;

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

    test("should create an enrollment", async () => {
        const response = await request(app)
            .post("/api/enrollments")
            .set("Authorization", `Bearer ${studentToken}`)
            .send({
                student: student._id.toString(),
                subject: subject._id.toString(),
                academicYear: "2026-27",
                semester: 3,
                section: "A"
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe(
            "Student enrolled successfully"
        );

        enrollment = response.body.data;

        const savedEnrollment = await Enrollment.findById(
            enrollment._id
        );

        expect(savedEnrollment).not.toBeNull();
    });

    test("should get student enrollments", async () => {
        await Enrollment.create({
            student: student._id,
            subject: subject._id,
            academicYear: "2026-27",
            semester: 3,
            section: "A"
        });

        const response = await request(app)
            .get(`/api/enrollments/student/${student._id}`)
            .set("Authorization", `Bearer ${studentToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe(
            "Enrollments fetched successfully"
        );
        expect(response.body.data.length).toBe(1);
    });

    test("should get subject students", async () => {
        await Enrollment.create({
            student: student._id,
            subject: subject._id,
            academicYear: "2026-27",
            semester: 3,
            section: "A"
        });

        const response = await request(app)
            .get(`/api/enrollments/subject/${subject._id}`)
            .set("Authorization", `Bearer ${studentToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe(
            "Subject students fetched successfully"
        );
        expect(response.body.data.length).toBe(1);
    });

    test("should delete an enrollment", async () => {
        enrollment = await Enrollment.create({
            student: student._id,
            subject: subject._id,
            academicYear: "2026-27",
            semester: 3,
            section: "A"
        });

        const response = await request(app)
            .delete(`/api/enrollments/${enrollment._id}`)
            .set("Authorization", `Bearer ${studentToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe(
            "Enrollment deleted successfully"
        );

        const deletedEnrollment = await Enrollment.findById(
            enrollment._id
        );

        expect(deletedEnrollment).toBeNull();
    });
});