import { Request, Response, NextFunction } from "express";
import { verifyToken, TokenPayload } from "../utils/jwt.js";

// Extendemos Request para poder colgar el usuario autenticado
export interface AuthRequest extends Request {
  user?: TokenPayload;
}

// Middleware: protege una ruta exigiendo un JWT valido en el header Authorization
export const requireAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Token no proporcionado" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalido o expirado" });
  }
};

export const requireRole = (...roles: Array<"Admin" | "analyst">) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "No autenticado" });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        message: "No tienes permisos suficientes para esta operacion",
      });
      return;
    }

    next();
  };
};
