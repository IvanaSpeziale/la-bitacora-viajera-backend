import { Request, Response } from "express";
import { PostgresAuthRepository } from "../../infrastructure/database/PostgresAuthRepository";

const authRepo = new PostgresAuthRepository();

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await authRepo.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await authRepo.getUserById(req.params.id);
    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuario" });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    let { is_admin } = req.body;

    // Normaliza el valor a booleano solo si es válido
    if (typeof is_admin === "string") {
      is_admin = is_admin === "true";
    } else if (typeof is_admin !== "boolean") {
      res.status(400).json({ message: "El campo is_admin debe ser booleano." });
      return;
    }

    await authRepo.updateAccountRoleByUserId(userId, is_admin);

    // Opcional: devolver el usuario actualizado
    const updatedUser = await authRepo.getUserById(userId);
    res.json({ data: updatedUser, message: "Rol actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el rol" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    await authRepo.deleteUserById(req.params.id);
    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
};
