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

describe("Subject Business Rules", () => {

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

        course = await Course.create({
            name: "Bachelor of Technology",
            code: "BTECH",
            department: department._id,
            duration: 4
        });
    });

    afterAll(async () => {
        await closeTestDB();
    });

    test("should reject duplicate subject code", async () => {

        const subjectData = {
            name: "Data Structures",
            code: "DS101",
            course: course._id.toString(),
            semester: 3,
            credits: 4,
            description: "Data Structures and Algorithms"
        };

        const firstResponse = await request(app)
            .post("/api/subjects")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(subjectData);

        expect(firstResponse.statusCode).toBe(201);

        const secondResponse = await request(app)
            .post("/api/subjects")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                ...subjectData,
                name: "Advanced Data Structures"
            });

        expect(secondResponse.statusCode).toBe(400);
        expect(secondResponse.body.message).toBe(
            "Subject already exists"
        );

        const subjects = await Subject.find({
            code: "DS101"
        });

        expect(subjects.length).toBe(1);
    });
});