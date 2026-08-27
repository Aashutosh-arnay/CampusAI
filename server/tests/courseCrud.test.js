jest.mock("sanitize-html", () => {
    return (value) => value;
});

const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const app = require("../src/app");

const Course = require("../src/models/Course");
const Department = require("../src/models/Department");

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

describe("Course CRUD", () => {

    let department;
    let course;

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

    test("should create a course", async () => {
        const response = await request(app)
            .post("/api/courses")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "Bachelor of Technology",
                code: "BTECH",
                department: department._id.toString(),
                duration: 4,
                description: "B.Tech program"
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe("Course created successfully");

        expect(response.body.data.name).toBe("Bachelor of Technology");
        expect(response.body.data.code).toBe("BTECH");

        course = response.body.data;

        const savedCourse = await Course.findById(course._id);
        expect(savedCourse).not.toBeNull();
    });

    test("should get all courses", async () => {
        await Course.create({
            name: "Bachelor of Technology",
            code: "BTECH",
            department: department._id,
            duration: 4,
            description: "B.Tech program"
        });

        const response = await request(app)
            .get("/api/courses")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Courses fetched successfully");
        expect(response.body.data.length).toBe(1);
    });

    test("should get course by ID", async () => {
        course = await Course.create({
            name: "Bachelor of Technology",
            code: "BTECH",
            department: department._id,
            duration: 4,
            description: "B.Tech program"
        });

        const response = await request(app)
            .get(`/api/courses/${course._id}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Course fetched successfully");
        expect(response.body.data._id).toBe(course._id.toString());
    });

    test("should update a course", async () => {
        course = await Course.create({
            name: "Bachelor of Technology",
            code: "BTECH",
            department: department._id,
            duration: 4,
            description: "B.Tech program"
        });

        const response = await request(app)
            .put(`/api/courses/${course._id}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "Bachelor of Technology Updated",
                duration: 5
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Course updated successfully");
        expect(response.body.data.name).toBe(
            "Bachelor of Technology Updated"
        );
        expect(response.body.data.duration).toBe(5);
    });

    test("should delete a course", async () => {
        course = await Course.create({
            name: "Bachelor of Technology",
            code: "BTECH",
            department: department._id,
            duration: 4,
            description: "B.Tech program"
        });

        const response = await request(app)
            .delete(`/api/courses/${course._id}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Course deleted successfully");

        const deletedCourse = await Course.findById(course._id);
        expect(deletedCourse).toBeNull();
    });
});