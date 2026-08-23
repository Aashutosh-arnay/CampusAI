jest.mock("sanitize-html", () => {
    return (value) => value;
});

const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const app = require("../src/app");

const Subject = require("../src/models/Subject");
const Course = require("../src/models/Course");
const Department = require("../src/models/Department");

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

describe("Subject CRUD", () => {

    let department;
    let course;
    let subject;

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
            duration: 4,
            description: "B.Tech program"
        });
    });

    afterAll(async () => {
        await closeTestDB();
    });

    test("should create a subject", async () => {
        const response = await request(app)
            .post("/api/subjects")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "Data Structures",
                code: "DS101",
                course: course._id.toString(),
                semester: 3,
                credits: 4,
                description: "Data Structures and Algorithms"
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe("Subject created successfully");
        expect(response.body.data.name).toBe("Data Structures");
        expect(response.body.data.code).toBe("DS101");

        subject = response.body.data;

        const savedSubject = await Subject.findById(subject._id);
        expect(savedSubject).not.toBeNull();
    });

    test("should get all subjects", async () => {
        await Subject.create({
            name: "Data Structures",
            code: "DS101",
            course: course._id,
            semester: 3,
            credits: 4
        });

        const response = await request(app)
            .get("/api/subjects")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Subjects fetched successfully");
        expect(response.body.data.length).toBe(1);
    });

    test("should get subject by ID", async () => {
        subject = await Subject.create({
            name: "Data Structures",
            code: "DS101",
            course: course._id,
            semester: 3,
            credits: 4
        });

        const response = await request(app)
            .get(`/api/subjects/${subject._id}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Subject fetched successfully");
        expect(response.body.data._id).toBe(subject._id.toString());
    });

    test("should update a subject", async () => {
        subject = await Subject.create({
            name: "Data Structures",
            code: "DS101",
            course: course._id,
            semester: 3,
            credits: 4
        });

        const response = await request(app)
            .put(`/api/subjects/${subject._id}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "Advanced Data Structures",
                credits: 5
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Subject updated successfully");
        expect(response.body.data.name).toBe("Advanced Data Structures");
        expect(response.body.data.credits).toBe(5);
    });

    test("should delete a subject", async () => {
        subject = await Subject.create({
            name: "Data Structures",
            code: "DS101",
            course: course._id,
            semester: 3,
            credits: 4
        });

        const response = await request(app)
            .delete(`/api/subjects/${subject._id}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Subject deleted successfully");

        const deletedSubject = await Subject.findById(subject._id);
        expect(deletedSubject).toBeNull();
    });
});