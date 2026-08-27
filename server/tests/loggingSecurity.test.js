const fs = require("fs");
const path = require("path");

describe("Logging Security", () => {

    test("Morgan configuration should not log request bodies or authorization headers", () => {

        const appPath = path.join(__dirname, "../src/app.js");
        const appSource = fs.readFileSync(appPath, "utf8");

        expect(appSource).not.toContain("morgan(':body");
        expect(appSource).not.toContain("req.body");
        expect(appSource).not.toContain("req.headers.authorization");

    });

});