const { RateLimiterMemory } = require("rate-limiter-flexible");

const loginLimiter = new RateLimiterMemory({
    points: 5,
    duration: 15 * 60
});

const loginIpLimiter = new RateLimiterMemory({
    points: 20,
    duration: 15 * 60
});

module.exports = {
    loginLimiter,
    loginIpLimiter
};