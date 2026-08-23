const mongoose = require("mongoose");
const dns = require("dns");
const logger = require("../utils/logger");

// Force Node to use a public DNS resolver for the SRV lookup.
// Fixes "querySrv ECONNREFUSED" caused by ISP/router/VPN DNS servers
// that don't handle mongodb+srv SRV records properly.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    logger.info("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    logger.error("MongoDB connection error", {
      error: error.message,
      stack: error.stack
    });

    process.exit(1);
  }
};

module.exports = connectDB;