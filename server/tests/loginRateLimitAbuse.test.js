const request = require("supertest");

const app = require("../src/app");
const loginLimiter = require("../src/config/loginLimiter");
const User = require("../src/models/User");

jest.mock("sanitize-html", () => {
    return (value) => value;
});

jest.mock("../src/models/User", () => ({
    findOne: jest.fn()
}));

describe("Login Rate Limit Abuse Protection", () => {

    beforeEach(async () => {

        jest.clearAllMocks();

        const selectMock = jest.fn().mockResolvedValue(null);

        User.findOne.mockReturnValue({
            select: selectMock
        });

        const emails = [
            "abuse1@example.com",
            "abuse2@example.com",
            "abuse3@example.com",
            "abuse4@example.com",
            "abuse5@example.com",
            "abuse6@example.com"
        ];

        for (const email of emails) {
            const key = `::ffff:127.0.0.1:${email}`;

            try {
                await loginLimiter.delete(key);
            } catch (error) {
                // Ignore cleanup errors
            }
        }
    });

    test("should block excessive login attempts from the same IP across different emails", async () => {

        const responses = [];

        for (let i = 1; i <= 21; i++) {

            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    email: `abuse${i}@example.com`,
                    password: "wrongpassword"
                });

            responses.push(response.statusCode);
        }

        expect(responses.slice(0, 20).every(status => status === 404))
            .toBe(true);

        expect(responses[20]).toBe(429);

    });

});