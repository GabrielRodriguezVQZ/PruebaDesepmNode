import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const JWT_EXPIRES_IN = "8h";

export interface TokenPayload {
  id: string;
  email: string;
  role: "administrador" | "analista";
}

// Genera un JWT firmado con el payload del usuario autenticado
export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Verifica y decodifica un JWT. Lanza error si es invalido o expiro
export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};
