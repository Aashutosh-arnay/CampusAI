const loginLimiter = require("../config/loginLimiter");

const loginRateLimiter = async (req, res, next) => {
    const key = `${req.ip}:${req.body.email || "unknown"}`;

    try {
        await loginLimiter.consume(key);
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
                await loginLimiter.delete(key);
            } catch (error) {
                console.error("Failed to reset login limiter:", error.message);
            }
        }
    });

    next();
};

module.exports = loginRateLimiter;