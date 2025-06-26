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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUserRole = exports.getUserById = exports.getAllUsers = void 0;
const PostgresAuthRepository_1 = require("../../infrastructure/database/PostgresAuthRepository");
const authRepo = new PostgresAuthRepository_1.PostgresAuthRepository();
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield authRepo.getAllUsers();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener usuarios" });
    }
});
exports.getAllUsers = getAllUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield authRepo.getUserById(req.params.id);
        if (!user) {
            res.status(404).json({ message: "Usuario no encontrado" });
            return;
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener usuario" });
    }
});
exports.getUserById = getUserById;
const updateUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        let { is_admin } = req.body;
        // Normaliza el valor a booleano solo si es válido
        if (typeof is_admin === "string") {
            is_admin = is_admin === "true";
        }
        else if (typeof is_admin !== "boolean") {
            res.status(400).json({ message: "El campo is_admin debe ser booleano." });
            return;
        }
        yield authRepo.updateAccountRoleByUserId(userId, is_admin);
        // Opcional: devolver el usuario actualizado
        const updatedUser = yield authRepo.getUserById(userId);
        res.json({ data: updatedUser, message: "Rol actualizado correctamente" });
    }
    catch (error) {
        res.status(500).json({ message: "Error al actualizar el rol" });
    }
});
exports.updateUserRole = updateUserRole;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield authRepo.deleteUserById(req.params.id);
        res.json({ message: "Usuario eliminado" });
    }
    catch (error) {
        res.status(500).json({ message: "Error al eliminar usuario" });
    }
});
exports.deleteUser = deleteUser;
