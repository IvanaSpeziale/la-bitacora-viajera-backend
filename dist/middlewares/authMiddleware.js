"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.JWT_SECRET || "defaultsecret";
const authMiddleware = (req, res, next) => {
    var _a;
    console.log("Middleware authMiddleware ejecutado");
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "No autorizado" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.user = { id: decoded.id };
        console.log("Encabezados de la solicitud:", req.headers);
        console.log("Token recibido:", req.headers.authorization);
        console.log("Usuario autenticado:", req.user);
        next();
    }
    catch (error) {
        console.error("Error de autenticación:", error);
        res.status(401).json({ message: "Token inválido" });
    }
};
exports.authMiddleware = authMiddleware;
const adminMiddleware = (req, res, next) => {
    if (!req.user) {
        res.status(403).json({
            message: "Acceso denegado. Se requiere rol de administrador.",
        });
        return;
    }
    next();
};
exports.adminMiddleware = adminMiddleware;
