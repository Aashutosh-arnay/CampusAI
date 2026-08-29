const {
    loginLimiter,
    loginIpLimiter
} = require("../config/loginLimiter");

const logger = require("../utils/logger");

const loginRateLimiter = async (req, res, next) => {
    const emailKey = `${req.ip}:${req.body.email || "unknown"}`;
    const ipKey = req.ip;

    try {
        await loginLimiter.consume(emailKey);
        await loginIpLimiter.consume(ipKey);
    } catch (rateLimiterRes) {
        const retryAfter = Math.ceil(
            rateLimiterRes.msBeforeNext / 1000
        );

        res.set("Retry-After", retryAfter);

        return res.status(429).json({
            success: false,
            statusCode: 429,
            message: `Too many login attempts. Try again in ${retryAfter} seconds.`
        });
    }

    res.on("finish", async () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
                await loginLimiter.delete(emailKey);
                await loginIpLimiter.delete(ipKey);
            } catch (error) {
                logger.error("Failed to reset login limiter", {
                    error: error.message,
                    stack: error.stack
                });
            }
        }
    });

    next();
};

module.exports = loginRateLimiter;