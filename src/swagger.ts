import swaggerJsdoc from "swagger-jsdoc";
import path from "path";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "KAPEE Ecommerce API",
      version: "1.0.0",
      description: "API documentation for the KAPEE ecommerce backend",
    },
    servers: [
      {
        url: process.env.SERVER_URL || "http://localhost:" + (process.env.PORT || 5000),
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [
    path.join(__dirname, "./routes/*.ts"),
    path.join(__dirname, "./controllers/*.ts"),
    path.join(__dirname, "./models/*.ts"),
  ],
};

export const swaggerSpec = swaggerJsdoc(options);


