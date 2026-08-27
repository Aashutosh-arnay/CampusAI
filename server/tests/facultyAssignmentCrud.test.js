jest.mock("sanitize-html", () => {
    return (value) => value;
});

const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const app = require("../src/app");

const User = require("../src/models/User");
const Department = require("../src/models/Department");
const Faculty = require("../src/models/Faculty");
const Course = require("../src/models/Course");
const Subject = require("../src/models/Subject");
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

describe("Faculty Assignment CRUD", () => {

    let department;
    let user;
    let faculty;
    let course;
    let subject;
    let assignment;

    beforeAll(async () => {
        await connectTestDB();
    });

    beforeEach(async () => {
        await clearTestDB();

        department = await Department.create({
            name: "Computer Science Engineering",
            code: "CSE"
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
            designation: "Assistant Professor",
            phone: "9876543210"
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
    });

    afterAll(async () => {
        await closeTestDB();
    });

    test("should create a faculty assignment", async () => {
        const response = await request(app)
            .post("/api/faculty-assignments")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                faculty: faculty._id.toString(),
                subject: subject._id.toString(),
                academicYear: "2026-27",
                semester: 3,
                section: "A"
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe("Faculty assigned successfully");
        expect(response.body.data.faculty.toString()).toBe(
            faculty._id.toString()
        );
        expect(response.body.data.subject.toString()).toBe(
            subject._id.toString()
        );

        assignment = response.body.data;

        const savedAssignment = await FacultyAssignment.findById(
            assignment._id
        );

        expect(savedAssignment).not.toBeNull();
        expect(savedAssignment.section).toBe("A");
    });

    test("should get all faculty assignments", async () => {
        await FacultyAssignment.create({
            faculty: faculty._id,
            subject: subject._id,
            academicYear: "2026-27",
            semester: 3,
            section: "A"
        });

        const response = await request(app)
            .get("/api/faculty-assignments")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe(
            "Faculty assignments fetched successfully"
        );
        expect(response.body.data.length).toBe(1);
    });

    test("should get assignment by ID", async () => {
        assignment = await FacultyAssignment.create({
            faculty: faculty._id,
            subject: subject._id,
            academicYear: "2026-27",
            semester: 3,
            section: "A"
        });

        const response = await request(app)
            .get(`/api/faculty-assignments/${assignment._id}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Assignment fetched successfully");
        expect(response.body.data._id).toBe(
            assignment._id.toString()
        );
    });

    test("should update a faculty assignment", async () => {
        assignment = await FacultyAssignment.create({
            faculty: faculty._id,
            subject: subject._id,
            academicYear: "2026-27",
            semester: 3,
            section: "A"
        });

        const response = await request(app)
            .put(`/api/faculty-assignments/${assignment._id}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                section: "B"
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe(
            "Assignment updated successfully"
        );
        expect(response.body.data.section).toBe("B");
    });

    test("should delete a faculty assignment", async () => {
        assignment = await FacultyAssignment.create({
            faculty: faculty._id,
            subject: subject._id,
            academicYear: "2026-27",
            semester: 3,
            section: "A"
        });

        const response = await request(app)
            .delete(`/api/faculty-assignments/${assignment._id}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe(
            "Assignment deleted successfully"
        );

        const deletedAssignment = await FacultyAssignment.findById(
            assignment._id
        );

        expect(deletedAssignment).toBeNull();
    });
});