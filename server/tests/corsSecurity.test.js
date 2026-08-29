jest.mock("sanitize-html", () => {
    return (value) => value;
});
const request = require("supertest");
const app = require("../src/app");

describe("CORS Security", () => {

    test("should allow the configured client origin", async () => {

        const response = await request(app)
            .get("/")
            .set("Origin", "http://localhost:5173");

        expect(response.headers["access-control-allow-origin"])
            .toBe("http://localhost:5173");

    });

    test("should not allow an arbitrary origin", async () => {

        const response = await request(app)
            .get("/")
            .set("Origin", "https://malicious-site.example");

        expect(response.headers["access-control-allow-origin"])
            .not.toBe("https://malicious-site.example");

    });

});