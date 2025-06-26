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
exports.signup = exports.login = void 0;
const LoginUser_1 = require("../../application/use-cases/login/LoginUser");
const uuid_1 = require("uuid");
const PostgresAuthRepository_1 = require("../../infrastructure/database/PostgresAuthRepository");
const authRepo = new PostgresAuthRepository_1.PostgresAuthRepository();
const loginUser = new LoginUser_1.LoginUser(authRepo);
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const token = yield loginUser.execute(email, password);
        if (!token) {
            res.status(401).json({ message: "Credenciales inválidas" });
            return;
        }
        res.json({ token });
    }
    catch (error) {
        res.status(500).json({ message: "Error interno del servidor" });
    }
});
exports.login = login;
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name, surname, country } = req.body;
    const newUser = { id: (0, uuid_1.v4)(), email, password, name, surname, country };
    const token = yield authRepo.signup(newUser);
    res.status(201).json({ token });
});
exports.signup = signup;
