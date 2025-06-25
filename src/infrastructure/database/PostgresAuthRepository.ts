import { AuthRepository } from "../../domain/repositories/AuthRepository";
import { User } from "../../domain/entities/User";
import { LoginRequestDTO } from "../../domain/dtos/LoginRequestDTO";
import pool from "./db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const secret = process.env.JWT_SECRET || "defaultsecret";

export class PostgresAuthRepository implements AuthRepository {
  async login(request: LoginRequestDTO): Promise<string | null> {
    const { email, password } = request;

    try {
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      const user = result.rows[0];
      if (!user) return null;

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return null;

      return jwt.sign({ id: user.id }, secret, { expiresIn: "1h" });
    } catch (error) {
      console.error("Error en login:", error);
      throw new Error("Error al iniciar sesión");
    }
  }

  async signup(user: User): Promise<string> {
    try {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await pool.query(
        "INSERT INTO users (id, email, password, name, surname, country) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          user.id,
          user.email,
          hashedPassword,
          user.name,
          user.surname,
          user.country,
        ]
      );
      // Log para depuración
      console.log("Usuario insertado:", user.id);
      const result = await pool.query(
        "INSERT INTO account (user_id, is_admin) VALUES ($1, $2) RETURNING *",
        [user.id, false]
      );
      console.log("Account insertado:", result.rows[0]);
      return jwt.sign({ id: user.id }, secret, { expiresIn: "1h" });
    } catch (error: any) {
      console.error("Error en signup:", error, error.detail);
      throw new Error("Error al registrar el usuario");
    }
  }

  async getUserById(id: string): Promise<any | null> {
    try {
      const result = await pool.query(
        `
        SELECT u.*, a.is_admin 
        FROM users u 
        LEFT JOIN account a ON u.id = a.user_id
        WHERE u.id = $1
      `,
        [id]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error al obtener usuario por ID:", error);
      throw new Error("Error al obtener el usuario");
    }
  }

  async updateUserById(id: string, updates: Partial<User>): Promise<void> {
    try {
      if ("isAdmin" in updates) {
        delete (updates as any).isAdmin;
      }
      const fields = Object.keys(updates).map(
        (key, index) => `${key} = $${index + 2}`
      );
      const values = [id, ...Object.values(updates)];

      const query = `UPDATE users SET ${fields.join(", ")} WHERE id = $1`;
      await pool.query(query, values);
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      throw new Error("Error al actualizar el usuario");
    }
  }

  async getAllUsers(): Promise<any[]> {
    try {
      const result = await pool.query(
        `
        SELECT u.*, a.is_admin 
        FROM users u 
        LEFT JOIN account a ON u.id = a.user_id
      `
      );
      return result.rows;
    } catch (error) {
      console.error("Error al obtener todos los usuarios:", error);
      throw new Error("Error al obtener usuarios");
    }
  }

  async updateAccountRoleByUserId(
    userId: string,
    isAdmin: boolean
  ): Promise<void> {
    try {
      await pool.query("UPDATE account SET is_admin = $1 WHERE user_id = $2", [
        isAdmin,
        userId,
      ]);
    } catch (error) {
      console.error("Error al actualizar el rol de la cuenta:", error);
      throw new Error("Error al actualizar el rol de la cuenta");
    }
  }

  async deleteUserById(userId: string): Promise<void> {
    try {
      await pool.query("DELETE FROM account WHERE user_id = $1", [userId]);
      await pool.query("DELETE FROM users WHERE id = $1", [userId]);
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      throw new Error("Error al eliminar usuario");
    }
  }
}
