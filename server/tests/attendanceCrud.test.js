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
const Student = require("../src/models/Student");
const Enrollment = require("../src/models/Enrollment");
const FacultyAssignment = require("../src/models/FacultyAssignment");
const Attendance = require("../src/models/Attendance");

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

describe("Attendance CRUD", () => {

    let department;
    let course;
    let subject;
    let studentUser;
    let student;
    let enrollment;
    let facultyUser;
    let faculty;
    let facultyAssignment;
    let attendance;

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

        enrollment = await Enrollment.create({
            student: student._id,
            subject: subject._id,
            academicYear: "2026-27",
            semester: 3,
            section: "A"
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

    test("should mark attendance", async () => {
        const response = await request(app)
            .post("/api/attendance")
            .set("Authorization", `Bearer ${facultyToken}`)
            .send({
                enrollment: enrollment._id.toString(),
                facultyAssignment: facultyAssignment._id.toString(),
                date: "2026-08-20T09:00:00.000Z",
                status: "Present",
                remarks: "Regular class"
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe(
            "Attendance marked successfully"
        );
        expect(response.body.data.status).toBe("Present");

        attendance = response.body.data;

        const savedAttendance = await Attendance.findById(
            attendance._id
        );

        expect(savedAttendance).not.toBeNull();
    });

    test("should get all attendance records", async () => {
        await Attendance.create({
            enrollment: enrollment._id,
            facultyAssignment: facultyAssignment._id,
            date: new Date("2026-08-20T09:00:00.000Z"),
            status: "Present"
        });

        const response = await request(app)
            .get("/api/attendance")
            .set("Authorization", `Bearer ${facultyToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe(
            "Attendance records fetched successfully"
        );
        expect(response.body.data.length).toBe(1);
    });

    test("should update attendance", async () => {
        attendance = await Attendance.create({
            enrollment: enrollment._id,
            facultyAssignment: facultyAssignment._id,
            date: new Date("2026-08-20T09:00:00.000Z"),
            status: "Present"
        });

        const response = await request(app)
            .put(`/api/attendance/${attendance._id}`)
            .set("Authorization", `Bearer ${facultyToken}`)
            .send({
                status: "Late",
                remarks: "Arrived late"
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe(
            "Attendance updated successfully"
        );
        expect(response.body.data.status).toBe("Late");
        expect(response.body.data.remarks).toBe("Arrived late");
    });

    test("should delete attendance", async () => {
        attendance = await Attendance.create({
            enrollment: enrollment._id,
            facultyAssignment: facultyAssignment._id,
            date: new Date("2026-08-20T09:00:00.000Z"),
            status: "Present"
        });

        const response = await request(app)
            .delete(`/api/attendance/${attendance._id}`)
            .set("Authorization", `Bearer ${facultyToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe(
            "Attendance deleted successfully"
        );

        const deletedAttendance = await Attendance.findById(
            attendance._id
        );

        expect(deletedAttendance).toBeNull();
    });
});