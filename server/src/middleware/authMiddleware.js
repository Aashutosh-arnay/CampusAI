const jwt = require("jsonwebtoken");
const { config } = require("../config/env");

const authMiddleware = (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {

            return res.status(401).json({
                message: "No token provided"
            });

        }

        const [scheme, token] = authHeader.split(" ");

        if (scheme !== "Bearer" || !token) {

            return res.status(401).json({
                message: "Invalid authorization format"
            });

        }

        const decoded = jwt.verify(
            token,
            config.jwtSecret,
            {
                algorithms: ["HS256"]
            }
        );

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Invalid token"
        });

    }
};

module.exports = authMiddleware;