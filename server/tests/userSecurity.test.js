const User = require("../src/models/User");

const {
    connectTestDB,
    closeTestDB,
    clearTestDB
} = require("./setup");

describe("User Security", () => {

    beforeAll(async () => {
        await connectTestDB();
    });

    beforeEach(async () => {
        await clearTestDB();
    });

    afterAll(async () => {
        await closeTestDB();
    });

    test("should not return password when fetching user by default", async () => {

        const user = await User.create({
            name: "Security Test User",
            email: "security-user@example.com",
            password: "password123",
            role: "student"
        });

        const fetchedUser = await User.findById(user._id);

        expect(fetchedUser.password).toBeUndefined();
    });

    test("should return password only when explicitly selected", async () => {

        const user = await User.create({
            name: "Security Test User",
            email: "security-user-2@example.com",
            password: "password123",
            role: "student"
        });

        const fetchedUser = await User.findById(user._id)
            .select("+password");

        expect(fetchedUser.password).toBeDefined();
    });
});