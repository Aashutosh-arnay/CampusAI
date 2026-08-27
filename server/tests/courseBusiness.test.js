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

describe("Course Business Rules", () => {

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

    test("should reject duplicate course code", async () => {

        const courseData = {
            name: "Bachelor of Technology",
            code: "BTECH",
            department: department._id.toString(),
            duration: 4,
            description: "B.Tech program"
        };

        const firstResponse = await request(app)
            .post("/api/courses")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(courseData);

        expect(firstResponse.statusCode).toBe(201);

        const secondResponse = await request(app)
            .post("/api/courses")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                ...courseData,
                name: "Bachelor of Technology Duplicate"
            });

        expect(secondResponse.statusCode).toBe(400);
        expect(secondResponse.body.message).toBe(
            "Course already exists"
        );

        const courses = await Course.find({
            code: "BTECH"
        });

        expect(courses.length).toBe(1);
    });
});