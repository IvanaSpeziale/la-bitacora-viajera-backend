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
exports.LoginUser = void 0;
const LoginRequestDTO_1 = require("../../../domain/dtos/LoginRequestDTO");
class LoginUser {
    constructor(authRepo) {
        this.authRepo = authRepo;
    }
    execute(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const loginRequest = new LoginRequestDTO_1.LoginRequestDTO(email, password);
            return this.authRepo.login(loginRequest);
        });
    }
}
exports.LoginUser = LoginUser;
