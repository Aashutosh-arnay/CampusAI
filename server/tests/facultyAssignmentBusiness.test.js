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
const Faculty = require("../src/models/Faculty");
const FacultyAssignment = require("../src/models/FacultyAssignment");

const {
    connectTestDB,
    closeTestDB,
    clearTestDB
} = require("./setup");

const adminToken = jwt.sign(
    {
        id: new mongoose.Types.ObjectId().toString(),
        role: "admin"
    },
    process.env.JWT_SECRET
);

describe("Faculty Assignment Business Rules", () => {

    let department;
    let course;
    let subject;
    let user;
    let faculty;

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
            name: "Test Faculty",
            email: "faculty@test.com",
            password: "password123",
            role: "faculty"
        });

        faculty = await Faculty.create({
            user: user._id,
            employeeId: "FAC001",
            department: department._id,
            designation: "Assistant Professor"
        });
    });

    afterAll(async () => {
        await closeTestDB();
    });

    test("should reject duplicate faculty assignment", async () => {

        const assignmentData = {
            faculty: faculty._id.toString(),
            subject: subject._id.toString(),
            academicYear: "2026-27",
            semester: 3,
            section: "A"
        };

        const firstResponse = await request(app)
            .post("/api/faculty-assignments")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(assignmentData);

        expect(firstResponse.statusCode).toBe(201);

        const secondResponse = await request(app)
            .post("/api/faculty-assignments")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(assignmentData);

        expect(secondResponse.statusCode).toBe(400);
        expect(secondResponse.body.message).toBe(
            "Faculty is already assigned to this subject"
        );

        const assignments = await FacultyAssignment.find({});

        expect(assignments.length).toBe(1);
    });

    test("should reject assignment when faculty does not exist", async () => {
        const response = await request(app)
            .post("/api/faculty-assignments")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                faculty: new mongoose.Types.ObjectId().toString(),
                subject: subject._id.toString(),
                academicYear: "2026-27",
                semester: 3,
                section: "A"
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Faculty not found");
    });

    test("should reject assignment when subject does not exist", async () => {
        const response = await request(app)
            .post("/api/faculty-assignments")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                faculty: faculty._id.toString(),
                subject: new mongoose.Types.ObjectId().toString(),
                academicYear: "2026-27",
                semester: 3,
                section: "A"
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Subject not found");
    });

    test("should reject update that creates a duplicate assignment", async () => {
        const firstAssignment = await FacultyAssignment.create({
            faculty: faculty._id,
            subject: subject._id,
            academicYear: "2026-27",
            semester: 3,
            section: "A"
        });

        const secondAssignment = await FacultyAssignment.create({
            faculty: faculty._id,
            subject: subject._id,
            academicYear: "2026-27",
            semester: 3,
            section: "B"
        });

        const response = await request(app)
            .put(`/api/faculty-assignments/${secondAssignment._id}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                section: "A"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe(
            "Faculty is already assigned to this subject"
        );

        const unchangedAssignment = await FacultyAssignment.findById(
            secondAssignment._id
        );

        expect(unchangedAssignment.section).toBe("B");
    });
});