const request = require("supertest");

jest.mock("sanitize-html", () => {
    return (value) => value;
});

const app = require("../src/app");

describe("Payload Limits", () => {

    test("should reject JSON payloads larger than 10kb", async () => {

        const largePayload = {
            data: "x".repeat(20 * 1024)
        };

        const response = await request(app)
            .post("/api/auth/login")
            .send(largePayload);

        expect(response.statusCode).toBe(413);

    });

});