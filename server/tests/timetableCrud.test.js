jest.mock("sanitize-html", () => {
    return (value) => value;
});

const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const app = require("../src/app");

const Department = require("../src/models/Department");
const Course = require("../src/models/Course");
const Subject = require("../src/models/Subject");
const User = require("../src/models/User");
const Faculty = require("../src/models/Faculty");
const FacultyAssignment = require("../src/models/FacultyAssignment");
const Timetable = require("../src/models/Timetable");

const {
    connectTestDB,
    closeTestDB,
    clearTestDB
} = require("./setup");

process.env.JWT_SECRET = "test-secret";

const adminToken = jwt.sign(
    {
        id: new mongoose.Types.ObjectId().toString(),
        role: "admin"
    },
    process.env.JWT_SECRET
);

describe("Timetable CRUD", () => {

    let department;
    let course;
    let subject;
    let user;
    let faculty;
    let facultyAssignment;
    let timetable;

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

    test("should create a timetable entry", async () => {
        const response = await request(app)
            .post("/api/timetable")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                subject: subject._id.toString(),
                facultyAssignment: facultyAssignment._id.toString(),
                day: "Monday",
                startTime: "09:00",
                endTime: "10:00",
                roomNumber: "R101",
                academicYear: "2026-27",
                semester: 3,
                section: "A"
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe(
            "Timetable created successfully"
        );

        timetable = response.body.data;

        const savedTimetable = await Timetable.findById(
            timetable._id
        );

        expect(savedTimetable).not.toBeNull();
        expect(savedTimetable.roomNumber).toBe("R101");
    });

    test("should get timetable by section", async () => {
        await Timetable.create({
            subject: subject._id,
            facultyAssignment: facultyAssignment._id,
            day: "Monday",
            startTime: "09:00",
            endTime: "10:00",
            roomNumber: "R101",
            academicYear: "2026-27",
            semester: 3,
            section: "A"
        });

        const response = await request(app)
            .get("/api/timetable/section/2026-27/3/A")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe(
            "Section timetable fetched successfully"
        );
        expect(response.body.data.length).toBe(1);
    });

    test("should get timetable by faculty assignment", async () => {
        await Timetable.create({
            subject: subject._id,
            facultyAssignment: facultyAssignment._id,
            day: "Monday",
            startTime: "09:00",
            endTime: "10:00",
            roomNumber: "R101",
            academicYear: "2026-27",
            semester: 3,
            section: "A"
        });

        const response = await request(app)
            .get(`/api/timetable/faculty/${facultyAssignment._id}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe(
            "Faculty timetable fetched successfully"
        );
        expect(response.body.data.length).toBe(1);
    });

    test("should update a timetable entry", async () => {
        timetable = await Timetable.create({
            subject: subject._id,
            facultyAssignment: facultyAssignment._id,
            day: "Monday",
            startTime: "09:00",
            endTime: "10:00",
            roomNumber: "R101",
            academicYear: "2026-27",
            semester: 3,
            section: "A"
        });

        const response = await request(app)
            .put(`/api/timetable/${timetable._id}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                roomNumber: "R202",
                startTime: "10:00",
                endTime: "11:00"
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe(
            "Timetable updated successfully"
        );
        expect(response.body.data.roomNumber).toBe("R202");
    });

    test("should delete a timetable entry", async () => {
        timetable = await Timetable.create({
            subject: subject._id,
            facultyAssignment: facultyAssignment._id,
            day: "Monday",
            startTime: "09:00",
            endTime: "10:00",
            roomNumber: "R101",
            academicYear: "2026-27",
            semester: 3,
            section: "A"
        });

        const response = await request(app)
            .delete(`/api/timetable/${timetable._id}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe(
            "Timetable deleted successfully"
        );

        const deletedTimetable = await Timetable.findById(
            timetable._id
        );

        expect(deletedTimetable).toBeNull();
    });
});