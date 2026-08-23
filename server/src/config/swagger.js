const swaggerJsdoc = require("swagger-jsdoc");

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "CampusAI API",
            version: "1.0.0",
            description:
                "AI-powered College ERP and Placement Management System API"
        },

        servers: [
            {
                url: "http://localhost:5000",
                description: "Local Server"
            }
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
    },

    apis: [
        "./src/routes/*.js"
    ]
};


const swaggerSpec = swaggerJsdoc(swaggerOptions);


module.exports = swaggerSpec;