import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Skincare AI API",
      version: "1.0.0",
      description: "API documentation for Skincare App with AI recommendations"
    }
  },
  apis: ["./routes/*.js"], // where swagger comments will be read
};

const swaggerSpec = swaggerJsdoc(options);
export const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
