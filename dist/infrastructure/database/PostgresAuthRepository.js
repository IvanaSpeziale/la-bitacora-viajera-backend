"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresAuthRepository = void 0;
const db_1 = __importDefault(require("./db"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secret = process.env.JWT_SECRET || "defaultsecret";
class PostgresAuthRepository {
    login(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = request;
            try {
                const result = yield db_1.default.query("SELECT * FROM users WHERE email = $1", [
                    email,
                ]);
                const user = result.rows[0];
                if (!user)
                    return null;
                const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
                if (!isPasswordValid)
                    return null;
                return jsonwebtoken_1.default.sign({ id: user.id }, secret, { expiresIn: "1h" });
            }
            catch (error) {
                console.error("Error en login:", error);
                throw new Error("Error al iniciar sesión");
            }
        });
    }
    signup(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hashedPassword = yield bcrypt_1.default.hash(user.password, 10);
                yield db_1.default.query("INSERT INTO users (id, email, password, name, surname, country) VALUES ($1, $2, $3, $4, $5, $6)", [
                    user.id,
                    user.email,
                    hashedPassword,
                    user.name,
                    user.surname,
                    user.country,
                ]);
                // Log para depuración
                console.log("Usuario insertado:", user.id);
                const result = yield db_1.default.query("INSERT INTO account (user_id, is_admin) VALUES ($1, $2) RETURNING *", [user.id, false]);
                console.log("Account insertado:", result.rows[0]);
                return jsonwebtoken_1.default.sign({ id: user.id }, secret, { expiresIn: "1h" });
            }
            catch (error) {
                console.error("Error en signup:", error, error.detail);
                throw new Error("Error al registrar el usuario");
            }
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.default.query(`
        SELECT u.*, a.is_admin 
        FROM users u 
        LEFT JOIN account a ON u.id = a.user_id
        WHERE u.id = $1
      `, [id]);
                return result.rows[0] || null;
            }
            catch (error) {
                console.error("Error al obtener usuario por ID:", error);
                throw new Error("Error al obtener el usuario");
            }
        });
    }
    updateUserById(id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if ("isAdmin" in updates) {
                    delete updates.isAdmin;
                }
                const fields = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`);
                const values = [id, ...Object.values(updates)];
                const query = `UPDATE users SET ${fields.join(", ")} WHERE id = $1`;
                yield db_1.default.query(query, values);
            }
            catch (error) {
                console.error("Error al actualizar usuario:", error);
                throw new Error("Error al actualizar el usuario");
            }
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.default.query(`
        SELECT u.*, a.is_admin 
        FROM users u 
        LEFT JOIN account a ON u.id = a.user_id
      `);
                return result.rows;
            }
            catch (error) {
                console.error("Error al obtener todos los usuarios:", error);
                throw new Error("Error al obtener usuarios");
            }
        });
    }
    updateAccountRoleByUserId(userId, isAdmin) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield db_1.default.query("UPDATE account SET is_admin = $1 WHERE user_id = $2", [
                    isAdmin,
                    userId,
                ]);
            }
            catch (error) {
                console.error("Error al actualizar el rol de la cuenta:", error);
                throw new Error("Error al actualizar el rol de la cuenta");
            }
        });
    }
    deleteUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield db_1.default.query("DELETE FROM account WHERE user_id = $1", [userId]);
                yield db_1.default.query("DELETE FROM users WHERE id = $1", [userId]);
            }
            catch (error) {
                console.error("Error al eliminar usuario:", error);
                throw new Error("Error al eliminar usuario");
            }
        });
    }
}
exports.PostgresAuthRepository = PostgresAuthRepository;
