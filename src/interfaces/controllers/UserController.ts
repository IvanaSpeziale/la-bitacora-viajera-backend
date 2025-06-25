import { Request, Response } from "express";
import { PostgresAuthRepository } from "../../infrastructure/database/PostgresAuthRepository";

const authRepo = new PostgresAuthRepository();

export const getUserDetails = async (req: any, res: any): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    const user = await authRepo.getUserById(userId);
    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error("Error al obtener los detalles del usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const updateUserDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const user = await authRepo.getUserById(id);

    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    await authRepo.updateUserById(id, updates);

    res.json({ message: "Usuario actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar los detalles del usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
