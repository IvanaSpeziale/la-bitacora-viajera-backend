import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../interfaces/types/AuthenticatedRequest";

const secret = process.env.JWT_SECRET || "defaultsecret";

export const authMiddleware = (
  req: any,
  res: any,
  next: NextFunction
): void => {
  console.log("Middleware authMiddleware ejecutado");

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "No autorizado" });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as {
      id: string;
    };
    req.user = { id: decoded.id };

    console.log("Encabezados de la solicitud:", req.headers);
    console.log("Token recibido:", req.headers.authorization);
    console.log("Usuario autenticado:", req.user);
    next();
  } catch (error) {
    console.error("Error de autenticación:", error);
    res.status(401).json({ message: "Token inválido" });
  }
};

export const adminMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(403).json({
      message: "Acceso denegado. Se requiere rol de administrador.",
    });
    return;
  }
  next();
};
