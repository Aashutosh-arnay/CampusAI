jest.mock("sanitize-html", () => {
    return (value) => value;
});

const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/app");

const adminToken = jwt.sign(
    {
        id: "test-admin-id",
        role: "admin"
    },
    process.env.JWT_SECRET
);

describe("Department Validation", () => {

    test("should reject missing department name", async () => {
        const response = await request(app)
            .post("/api/departments")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                code: "CSE"
            });

        expect(response.statusCode).toBe(400);
    });

    test("should reject missing department code", async () => {
        const response = await request(app)
            .post("/api/departments")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "Computer Science Engineering"
            });

        expect(response.statusCode).toBe(400);
    });

    test("should reject department code shorter than 2 characters", async () => {
        const response = await request(app)
            .post("/api/departments")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "Computer Science Engineering",
                code: "C"
            });

        expect(response.statusCode).toBe(400);
    });

    test("should reject invalid HOD ID", async () => {
        const response = await request(app)
            .post("/api/departments")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "Computer Science Engineering",
                code: "CSE",
                hod: "invalid-id"
            });

        expect(response.statusCode).toBe(400);
    });

});