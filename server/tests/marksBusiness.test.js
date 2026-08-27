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

const facultyToken = jwt.sign(
    {
        id: new mongoose.Types.ObjectId().toString(),
        role: "faculty"
    },
    process.env.JWT_SECRET
);

describe("Marks Business Rules", () => {

    let department;
    let course;
    let subject;
    let studentUser;
    let student;
    let facultyUser;
    let faculty;
    let facultyAssignment;

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

    test("should calculate marks percentage correctly", async () => {

        await Marks.create([
            {
                student: student._id,
                subject: subject._id,
                facultyAssignment: facultyAssignment._id,
                examType: "Midterm",
                marksObtained: 80,
                totalMarks: 100
            },
            {
                student: student._id,
                subject: subject._id,
                facultyAssignment: facultyAssignment._id,
                examType: "End Semester",
                marksObtained: 150,
                totalMarks: 200
            }
        ]);

        const response = await request(app)
            .get(
                `/api/marks/percentage/${student._id}/${subject._id}`
            )
            .set("Authorization", `Bearer ${facultyToken}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.message).toBe(
            "Marks percentage calculated successfully"
        );

        expect(response.body.data.totalObtained).toBe(230);
        expect(response.body.data.totalMaximum).toBe(300);
        expect(response.body.data.percentage).toBe("76.67%");
    });
});