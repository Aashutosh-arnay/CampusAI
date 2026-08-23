const sanitizeHtml = require("sanitize-html");

const sanitizeValue = (value) => {
    if (typeof value === "string") {
        return sanitizeHtml(value, {
            allowedTags: [],
            allowedAttributes: {}
        });
    }

    if (Array.isArray(value)) {
        return value.map(sanitizeValue);
    }

    if (value && typeof value === "object") {
        const sanitized = {};

        for (const key of Object.keys(value)) {
            sanitized[key] = sanitizeValue(value[key]);
        }

        return sanitized;
    }

    return value;
};

const xssMiddleware = (req, res, next) => {
    req.body = sanitizeValue(req.body);
    req.params = sanitizeValue(req.params);

    next();
};

module.exports = xssMiddleware;