jest.mock("sanitize-html", () => {
    return (value) => value;
});

const request = require("supertest");
const app = require("../src/app");

describe("CampusAI API", () => {
    test("GET / should return backend running message", async () => {
        const response = await request(app).get("/");

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("CampusAI Backend Running 🚀");
    });
});