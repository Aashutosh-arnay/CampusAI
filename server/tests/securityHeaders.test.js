const request = require("supertest");

jest.mock("sanitize-html", () => {
    return (value) => value;
});

const app = require("../src/app");

describe("HTTP Security Headers", () => {

    test("should include Helmet security headers", async () => {

        const response = await request(app)
            .get("/");

        expect(response.headers["x-content-type-options"])
            .toBe("nosniff");

        expect(response.headers["x-frame-options"])
            .toBe("SAMEORIGIN");

        expect(response.headers["strict-transport-security"])
            .toBeDefined();

        expect(response.headers["content-security-policy"])
            .toBeDefined();

    });

});