jest.mock("sanitize-html", () => {
    return (value) => value;
});

const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const app = require("../src/app");

const Department = require("../src/models/Department");
const Course = require("../src/models/Course");

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

describe("Error and Edge Cases", () => {

    let department;

    beforeAll(async () => {
        await connectTestDB();
    });

    beforeEach(async () => {
        await clearTestDB();

        department = await Department.create({
            name: "Computer Science Engineering",
            code: "CSE"
        });
    });

    afterAll(async () => {
        await closeTestDB();
    });

    test("should return 404 for non-existent course ID", async () => {

        const nonExistentId = new mongoose.Types.ObjectId();

        const response = await request(app)
            .get(`/api/courses/${nonExistentId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Course not found");
    });

    test("should return 404 when deleting a non-existent course", async () => {

        const nonExistentId = new mongoose.Types.ObjectId();

        const response = await request(app)
            .delete(`/api/courses/${nonExistentId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Course not found");
    });

    test("should return 404 when updating a non-existent course", async () => {

        const nonExistentId = new mongoose.Types.ObjectId();

        const response = await request(app)
            .put(`/api/courses/${nonExistentId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "Updated Course"
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Course not found");
    });

    test("should reject request without authentication token", async () => {
        const response = await request(app)
            .get("/api/courses");

        expect(response.statusCode).toBe(401);
    });

    test("should reject request with an invalid authentication token", async () => {
        const response = await request(app)
            .get("/api/courses")
            .set("Authorization", "Bearer invalid-token");

        expect(response.statusCode).toBe(401);
    });
    const studentToken = jwt.sign(
        {
            id: new mongoose.Types.ObjectId().toString(),
            role: "student"
        },
        process.env.JWT_SECRET
    );

    test("should reject student from admin-only course creation", async () => {
        const response = await request(app)
            .post("/api/courses")
            .set("Authorization", `Bearer ${studentToken}`)
            .send({
                name: "Unauthorized Course",
                code: "UNAUTH",
                department: department._id.toString(),
                duration: 4
            });

        expect(response.statusCode).toBe(403);
    });

    test("should reject student from admin-only timetable creation", async () => {
        const response = await request(app)
            .post("/api/timetable")
            .set("Authorization", `Bearer ${studentToken}`)
            .send({
                subject: new mongoose.Types.ObjectId().toString(),
                facultyAssignment: new mongoose.Types.ObjectId().toString(),
                day: "Monday",
                startTime: "09:00",
                endTime: "10:00",
                roomNumber: "R101",
                academicYear: "2026-27",
                semester: 3,
                section: "A"
            });

        expect(response.statusCode).toBe(403);
    });

    test("should return 404 for non-existent subject", async () => {
        const nonExistentId = new mongoose.Types.ObjectId();

        const response = await request(app)
            .get(`/api/subjects/${nonExistentId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Subject not found");
    });

    test("should return 404 for non-existent timetable", async () => {
        const nonExistentId = new mongoose.Types.ObjectId();

        const response = await request(app)
            .put(`/api/timetable/${nonExistentId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                roomNumber: "R202"
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Timetable not found");
    });
});