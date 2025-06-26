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
exports.updateUserDetails = exports.getUserDetails = void 0;
const PostgresAuthRepository_1 = require("../../infrastructure/database/PostgresAuthRepository");
const authRepo = new PostgresAuthRepository_1.PostgresAuthRepository();
const getUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: "Usuario no autenticado" });
            return;
        }
        const user = yield authRepo.getUserById(userId);
        if (!user) {
            res.status(404).json({ message: "Usuario no encontrado" });
            return;
        }
        res.json(user);
    }
    catch (error) {
        console.error("Error al obtener los detalles del usuario:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});
exports.getUserDetails = getUserDetails;
const updateUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updates = req.body;
        const user = yield authRepo.getUserById(id);
        if (!user) {
            res.status(404).json({ message: "Usuario no encontrado" });
            return;
        }
        yield authRepo.updateUserById(id, updates);
        res.json({ message: "Usuario actualizado correctamente" });
    }
    catch (error) {
        console.error("Error al actualizar los detalles del usuario:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});
exports.updateUserDetails = updateUserDetails;
