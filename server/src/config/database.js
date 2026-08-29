const mongoose = require("mongoose");
const dns = require("dns");

const logger = require("../utils/logger");
const { config } = require("./env");

// Force Node to use public DNS resolvers for MongoDB SRV lookups.
// Kept from the existing CampusAI setup because it resolved the
// earlier mongodb+srv DNS issue.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {

    try {

        await mongoose.connect(config.mongodbUri);

        logger.info("✅ MongoDB Connected Successfully");

    } catch (error) {

        logger.error("MongoDB connection error", {
            error: error.message,
            stack: error.stack
        });

        process.exit(1);

    }

};

module.exports = connectDB;