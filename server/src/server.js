const { config, validateEnv } = require("./config/env");

const connectDB = require("./config/database");
const app = require("./app");
const logger = require("./utils/logger");

try {

    validateEnv();

} catch (error) {

    logger.error(error.message);

    process.exit(1);

}

const PORT = config.port;

connectDB();

app.listen(PORT, () => {

    logger.info(
        `🚀 Server is running on http://localhost:${PORT}`
    );

});