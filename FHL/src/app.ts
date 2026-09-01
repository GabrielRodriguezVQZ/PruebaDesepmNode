import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";

import { connectDB, sequelize } from "./config/db.js";
import { swaggerSpec } from "./config/swagger.js";
import "./models/associations.js";

import authRouter from "./modules/auth/auth.router.js";
import clientsRouter from "./modules/clients/clients.router.js";
import warehousesRouter from "./modules/warehouses/warehouses.router.js";
import productsRouter from "./modules/products/products.router.js";
import ordersRouter from "./modules/orders/orders.router.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas de la API
app.use("/auth", authRouter);
app.use("/clients", clientsRouter);
app.use("/warehouses", warehousesRouter);
app.use("/products", productsRouter);
app.use("/orders", ordersRouter);

app.get("/", (_req, res) => {
  res.json({ message: "FHL Logistica API - visita /api para ver la documentacion Swagger" });
});

const PORT = process.env.PORT || 3000;

const start = async () => {
  await connectDB();
  // Sincroniza los modelos con la base de datos
  await sequelize.sync();
  app.listen(PORT, () => {
    console.log(`server running en http://localhost:${PORT}`);
    console.log(`Documentacion Swagger disponible en http://localhost:${PORT}/api`);
  });
};

start();

export default app;
