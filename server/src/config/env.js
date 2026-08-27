require("dotenv").config();

const config = {
    get port() {
        return Number(process.env.PORT) || 5000;
    },

    get jwtSecret() {
        return process.env.JWT_SECRET;
    },

    get mongodbUri() {
        return process.env.MONGODB_URI;
    },

    get clientUrl() {
        return process.env.CLIENT_URL || "http://localhost:5173";
    },

    get logLevel() {
        return process.env.LOG_LEVEL || "info";
    }
};

const validateEnv = () => {

    const requiredEnvVariables = [
        "JWT_SECRET",
        "MONGODB_URI"
    ];

    const missingVariables = requiredEnvVariables.filter(
        (variable) => !process.env[variable]
    );

    if (missingVariables.length > 0) {

        throw new Error(
            `Missing required environment variable(s): ${missingVariables.join(", ")}`
        );

    }

};

module.exports = {
    config,
    validateEnv
};