const { param } = require("express-validator");

const mongoIdParam = (parameterName, label = parameterName) => [
    param(parameterName)
        .notEmpty()
        .withMessage(`${label} is required`)
        .isMongoId()
        .withMessage(`Invalid ${label}`)
];

module.exports = {
    mongoIdParam
};