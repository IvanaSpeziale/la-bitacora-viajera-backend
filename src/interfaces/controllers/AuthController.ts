import { Request, Response } from "express";
import { LoginUser } from "../../application/use-cases/login/LoginUser";
import { User } from "../../domain/entities/User";
import { v4 as uuid } from "uuid";
import { PostgresAuthRepository } from "../../infrastructure/database/PostgresAuthRepository";

const authRepo = new PostgresAuthRepository();
const loginUser = new LoginUser(authRepo);

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const token = await loginUser.execute(email, password);

    if (!token) {
      res.status(401).json({ message: "Credenciales inválidas" });
      return;
    }

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const signup = async (req: Request, res: Response) => {
  const { email, password, name, surname, country } = req.body;
  const newUser: User = { id: uuid(), email, password, name, surname, country };
  const token = await authRepo.signup(newUser);
  res.status(201).json({ token });
};
