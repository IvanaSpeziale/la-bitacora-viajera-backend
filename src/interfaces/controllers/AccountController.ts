import { PostgresAuthRepository } from "../../infrastructure/database/PostgresAuthRepository";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import { Response } from "express";

export const getAccountDetails = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    const authRepo = new PostgresAuthRepository();
    const user = await authRepo.getUserById(userId);

    if (!user) {
      res.status(404).json({ message: "Cuenta no encontrada" });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error("Error al obtener los detalles de la cuenta:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
