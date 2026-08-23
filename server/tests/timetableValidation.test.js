jest.mock("sanitize-html", () => {
    return (value) => value;
});

const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/app");

process.env.JWT_SECRET = "test-secret";

const adminToken = jwt.sign(
    {
        id: "test-admin-id",
        role: "admin"
    },
    process.env.JWT_SECRET
);

describe("Timetable Validation", () => {

    test("should reject invalid faculty assignment ID", async () => {
        const response = await request(app)
            .post("/api/timetable")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                facultyAssignment: "invalid-id",
                subject: "507f1f77bcf86cd799439011",
                academicYear: "2026-27",
                semester: 3,
                section: "A",
                roomNumber: "R101",
                day: "Monday",
                startTime: "09:00",
                endTime: "10:00"
            });

        expect(response.statusCode).toBe(400);
    });

    test("should reject invalid subject ID", async () => {
        const response = await request(app)
            .post("/api/timetable")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                facultyAssignment: "507f1f77bcf86cd799439011",
                subject: "invalid-id",
                academicYear: "2026-27",
                semester: 3,
                section: "A",
                roomNumber: "R101",
                day: "Monday",
                startTime: "09:00",
                endTime: "10:00"
            });

        expect(response.statusCode).toBe(400);
    });

    test("should reject invalid semester", async () => {
        const response = await request(app)
            .post("/api/timetable")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                facultyAssignment: "507f1f77bcf86cd799439011",
                subject: "507f1f77bcf86cd799439011",
                academicYear: "2026-27",
                semester: 9,
                section: "A",
                roomNumber: "R101",
                day: "Monday",
                startTime: "09:00",
                endTime: "10:00"
            });

        expect(response.statusCode).toBe(400);
    });

    test("should reject invalid day", async () => {
        const response = await request(app)
            .post("/api/timetable")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                facultyAssignment: "507f1f77bcf86cd799439011",
                subject: "507f1f77bcf86cd799439011",
                academicYear: "2026-27",
                semester: 3,
                section: "A",
                roomNumber: "R101",
                day: "Sunday",
                startTime: "09:00",
                endTime: "10:00"
            });

        expect(response.statusCode).toBe(400);
    });

    test("should reject missing room number", async () => {
        const response = await request(app)
            .post("/api/timetable")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                facultyAssignment: "507f1f77bcf86cd799439011",
                subject: "507f1f77bcf86cd799439011",
                academicYear: "2026-27",
                semester: 3,
                section: "A",
                day: "Monday",
                startTime: "09:00",
                endTime: "10:00"
            });

        expect(response.statusCode).toBe(400);
    });

    test("should reject missing start time", async () => {
        const response = await request(app)
            .post("/api/timetable")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                facultyAssignment: "507f1f77bcf86cd799439011",
                subject: "507f1f77bcf86cd799439011",
                academicYear: "2026-27",
                semester: 3,
                section: "A",
                roomNumber: "R101",
                day: "Monday",
                endTime: "10:00"
            });

        expect(response.statusCode).toBe(400);
    });

    test("should reject missing end time", async () => {
        const response = await request(app)
            .post("/api/timetable")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                facultyAssignment: "507f1f77bcf86cd799439011",
                subject: "507f1f77bcf86cd799439011",
                academicYear: "2026-27",
                semester: 3,
                section: "A",
                roomNumber: "R101",
                day: "Monday",
                startTime: "09:00"
            });

        expect(response.statusCode).toBe(400);
    });

});