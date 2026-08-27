jest.mock("sanitize-html", () => {
    return (value) => value;
});

jest.mock("../src/models/User", () => ({
    findOne: jest.fn()
}));

const request = require("supertest");
const app = require("../src/app");
const loginLimiter = require("../src/config/loginLimiter");
const User = require("../src/models/User");

describe("Login Security", () => {

    const email = "security-test@example.com";
    const password = "wrongpassword";

    beforeEach(async () => {
        jest.clearAllMocks();

        const key = `::ffff:127.0.0.1:${email}`;

        try {
            await loginLimiter.delete(key);
        } catch (error) {
            // Ignore cleanup errors
        }

        const selectMock = jest.fn().mockResolvedValue(null);

        User.findOne.mockReturnValue({
            select: selectMock
        });
    });

    test("should rate limit repeated login attempts", async () => {

        const responses = [];

        for (let i = 0; i < 5; i++) {

            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    email,
                    password
                });

            responses.push(response);
        }

        responses.forEach((response) => {
            expect(response.statusCode).toBe(404);
        });

        const blockedResponse = await request(app)
            .post("/api/auth/login")
            .send({
                email,
                password
            });

        expect(blockedResponse.statusCode).toBe(429);

        expect(blockedResponse.body.message).toMatch(
            /Too many login attempts/
        );

        expect(
            blockedResponse.headers["retry-after"]
        ).toBeDefined();
    });
});