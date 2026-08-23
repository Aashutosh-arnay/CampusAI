jest.mock("sanitize-html", () => {
    return (value) => value;
});

const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/app");

process.env.JWT_SECRET = "test-secret";

const facultyToken = jwt.sign(
    {
        id: "test-faculty-id",
        role: "faculty"
    },
    process.env.JWT_SECRET
);

describe("Faculty Validation", () => {

    test("should reject empty employeeId", async () => {
        const response = await request(app)
            .put("/api/faculty/profile")
            .set("Authorization", `Bearer ${facultyToken}`)
            .send({
                employeeId: "",
                department: "department-id",
                designation: "Professor"
            });

        expect(response.statusCode).toBe(400);
    });

    test("should reject empty department", async () => {
        const response = await request(app)
            .put("/api/faculty/profile")
            .set("Authorization", `Bearer ${facultyToken}`)
            .send({
                department: "",
                designation: "Professor"
            });

        expect(response.statusCode).toBe(400);
    });

    test("should reject empty designation", async () => {
        const response = await request(app)
            .put("/api/faculty/profile")
            .set("Authorization", `Bearer ${facultyToken}`)
            .send({
                designation: ""
            });

        expect(response.statusCode).toBe(400);
    });

    test("should reject empty phone", async () => {
        const response = await request(app)
            .put("/api/faculty/profile")
            .set("Authorization", `Bearer ${facultyToken}`)
            .send({
                phone: ""
            });

        expect(response.statusCode).toBe(400);
    });

});