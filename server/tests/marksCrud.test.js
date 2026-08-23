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
const Faculty = require("../src/models/Faculty");
const FacultyAssignment = require("../src/models/FacultyAssignment");
const Marks = require("../src/models/Marks");

const {
    connectTestDB,
    closeTestDB,
    clearTestDB
} = require("./setup");

process.env.JWT_SECRET = "test-secret";

const facultyToken = jwt.sign(
    {
        id: new mongoose.Types.ObjectId().toString(),
        role: "faculty"
    },
    process.env.JWT_SECRET
);

describe("Marks CRUD", () => {

    let department;
    let course;
    let subject;
    let studentUser;
    let student;
    let facultyUser;
    let faculty;
    let facultyAssignment;
    let marks;

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

        studentUser = await User.create({
            name: "Test Student",
            email: "student@test.com",
            password: "password123",
            role: "student"
        });

        student = await Student.create({
            user: studentUser._id,
            rollNumber: "CSE2026001",
            department: department._id,
            course: course._id,
            section: "A",
            semester: 3
        });

        facultyUser = await User.create({
            name: "Test Faculty",
            email: "faculty@test.com",
            password: "password123",
            role: "faculty"
        });

        faculty = await Faculty.create({
            user: facultyUser._id,
            employeeId: "FAC001",
            department: department._id,
            designation: "Assistant Professor"
        });

        facultyAssignment = await FacultyAssignment.create({
            faculty: faculty._id,
            subject: subject._id,
            academicYear: "2026-27",
            semester: 3,
            section: "A"
        });
    });

    afterAll(async () => {
        await closeTestDB();
    });

    test("should create marks", async () => {
        const response = await request(app)
            .post("/api/marks")
            .set("Authorization", `Bearer ${facultyToken}`)
            .send({
                student: student._id.toString(),
                subject: subject._id.toString(),
                facultyAssignment: facultyAssignment._id.toString(),
                marksObtained: 80,
                totalMarks: 100,
                examType: "Midterm",
                remarks: "Good performance"
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe("Marks added successfully");
        expect(response.body.data.marksObtained).toBe(80);
        expect(response.body.data.totalMarks).toBe(100);

        marks = response.body.data;

        const savedMarks = await Marks.findById(marks._id);
        expect(savedMarks).not.toBeNull();
    });

    test("should get student marks", async () => {
        await Marks.create({
            student: student._id,
            subject: subject._id,
            facultyAssignment: facultyAssignment._id,
            marksObtained: 80,
            totalMarks: 100,
            examType: "Midterm"
        });

        const response = await request(app)
            .get(`/api/marks/student/${student._id}`)
            .set("Authorization", `Bearer ${facultyToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe(
            "Student marks fetched successfully"
        );
        expect(response.body.data.length).toBe(1);
    });

    test("should get subject marks", async () => {
        await Marks.create({
            student: student._id,
            subject: subject._id,
            facultyAssignment: facultyAssignment._id,
            marksObtained: 80,
            totalMarks: 100,
            examType: "Midterm"
        });

        const response = await request(app)
            .get(`/api/marks/subject/${subject._id}`)
            .set("Authorization", `Bearer ${facultyToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe(
            "Subject marks fetched successfully"
        );
        expect(response.body.data.length).toBe(1);
    });

    test("should update marks", async () => {
        marks = await Marks.create({
            student: student._id,
            subject: subject._id,
            facultyAssignment: facultyAssignment._id,
            marksObtained: 80,
            totalMarks: 100,
            examType: "Midterm"
        });

        const response = await request(app)
            .put(`/api/marks/${marks._id}`)
            .set("Authorization", `Bearer ${facultyToken}`)
            .send({
                marksObtained: 90
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe(
            "Marks updated successfully"
        );
        expect(response.body.data.marksObtained).toBe(90);
    });

    test("should delete marks", async () => {
        marks = await Marks.create({
            student: student._id,
            subject: subject._id,
            facultyAssignment: facultyAssignment._id,
            marksObtained: 80,
            totalMarks: 100,
            examType: "Midterm"
        });

        const response = await request(app)
            .delete(`/api/marks/${marks._id}`)
            .set("Authorization", `Bearer ${facultyToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe(
            "Marks deleted successfully"
        );

        const deletedMarks = await Marks.findById(marks._id);
        expect(deletedMarks).toBeNull();
    });
});