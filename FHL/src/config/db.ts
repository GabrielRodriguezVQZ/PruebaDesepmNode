import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL no esta definida en el archivo .env");
}

// Instancia unica de Sequelize, conectada a PostgreSQL
export const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  logging: false,
});

export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL Conectado");
  } catch (error) {
    console.error("Error al conectar a PostgreSQL:", error);
    process.exit(1);
  }
};
