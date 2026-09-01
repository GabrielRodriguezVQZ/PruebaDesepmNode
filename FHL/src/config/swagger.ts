import swaggerJSDoc from "swagger-jsdoc";

// Configuracion de swagger-jsdoc: lee los comentarios JSDoc de los *.router.ts
const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FHL Logistica - API de Ordenes de Entrega",
      version: "1.0.0",
      description:
        "API REST para gestionar clientes, bodegas, productos y ordenes de entrega de la empresa de logistica FHL.",
    },
    servers: [
      {
        url: "http://localhost:" + (process.env.PORT || 3000),
        description: "Servidor local",
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
  apis: ["./src/modules/**/*.router.ts", "./dist/modules/**/*.router.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
