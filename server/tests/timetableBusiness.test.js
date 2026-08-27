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
const Timetable = require("../src/models/Timetable");

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

describe("Timetable Business Rules", () => {

    let department;
    let course;
    let subject;
    let user;
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

    test("should reject faculty timetable clash", async () => {

        const timetableData = {
            subject: subject._id.toString(),
            facultyAssignment: facultyAssignment._id.toString(),
            day: "Monday",
            startTime: "09:00",
            endTime: "10:00",
            roomNumber: "R101",
            academicYear: "2026-27",
            semester: 3,
            section: "A"
        };

        const firstResponse = await request(app)
            .post("/api/timetable")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(timetableData);

        expect(firstResponse.statusCode).toBe(201);

        const secondResponse = await request(app)
            .post("/api/timetable")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                ...timetableData,
                roomNumber: "R102"
            });

        expect(secondResponse.statusCode).toBe(400);

        expect(secondResponse.body.message).toBe(
            "Faculty already has a class at this time"
        );

        const timetableRecords = await Timetable.find({
            facultyAssignment: facultyAssignment._id,
            day: "Monday",
            startTime: "09:00",
            endTime: "10:00"
        });

        expect(timetableRecords.length).toBe(1);
    });

    test("should reject room timetable clash", async () => {

        const secondUser = await User.create({
            name: "Second Faculty",
            email: "faculty2@test.com",
            password: "password123",
            role: "faculty"
        });

        const secondFaculty = await Faculty.create({
            user: secondUser._id,
            employeeId: "FAC002",
            department: department._id,
            designation: "Assistant Professor"
        });

        const secondFacultyAssignment = await FacultyAssignment.create({
            faculty: secondFaculty._id,
            subject: subject._id,
            academicYear: "2026-27",
            semester: 3,
            section: "B"
        });

        const firstTimetable = {
            subject: subject._id.toString(),
            facultyAssignment: facultyAssignment._id.toString(),
            day: "Tuesday",
            startTime: "10:00",
            endTime: "11:00",
            roomNumber: "R201",
            academicYear: "2026-27",
            semester: 3,
            section: "A"
        };

        const firstResponse = await request(app)
            .post("/api/timetable")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(firstTimetable);

        expect(firstResponse.statusCode).toBe(201);

        const secondResponse = await request(app)
            .post("/api/timetable")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                ...firstTimetable,
                facultyAssignment: secondFacultyAssignment._id.toString(),
                section: "B"
            });

        expect(secondResponse.statusCode).toBe(400);

        expect(secondResponse.body.message).toBe(
            "Room is already occupied at this time"
        );

        const timetableRecords = await Timetable.find({
            roomNumber: "R201",
            day: "Tuesday",
            startTime: "10:00",
            endTime: "11:00"
        });

        expect(timetableRecords.length).toBe(1);
    });
});