// Swagger Setting
const swaggerUI = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    "openapi" : "3.0.0",
    "info" : {
        "version" : "1.0.0",
        "title" : "MJU Workation Platform",
        "description" : "2023 명지대학교 캡스톤디자인 4조 백엔드",
    },
    servers: [
      {
        url: "http://localhost:8080/api",
      }
    ]
    // "host" : process.env.DOMAIN,
    // "basePath": "/api/",
    // "paths": { },
    // "definitions": { },
    // "responses": { },
    // "parameters": { },
    // "securityDefinitions": {
    //   "bearerAuth": {
    //     "name": "Authorization",
    //     "in": "header",
    //     "type": "apiKey",
    //     "schema": "bearer",
    //     "bearerFormat": "JWT",
    //   }
    // }
};

const options = {
    swaggerDefinition: swaggerDefinition,
    apis: ["./routes/*.js", "./models/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = {
    swaggerUI,
    swaggerSpec
};