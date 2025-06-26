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
exports.GetNextDestinationsByUser = GetNextDestinationsByUser;
exports.GetNextDestinationById = GetNextDestinationById;
exports.CreateNextDestination = CreateNextDestination;
exports.UpdateNextDestination = UpdateNextDestination;
exports.DeleteNextDestination = DeleteNextDestination;
const NextDestinationRepository_1 = require("../../../infrastructure/database/NextDestinationRepository");
function GetNextDestinationsByUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, NextDestinationRepository_1.getNextDestinationsByUser)(userId);
    });
}
function GetNextDestinationById(id, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const destination = yield (0, NextDestinationRepository_1.getNextDestinationById)(Number(id), userId);
        if (!destination) {
            throw new Error(`El destino con ID ${id} no existe o no pertenece al usuario.`);
        }
        return destination;
    });
}
function CreateNextDestination(name, targetDate, createdDate, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, NextDestinationRepository_1.createNextDestination)(name, targetDate, createdDate, userId);
    });
}
function UpdateNextDestination(id, name, targetDate, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const updatedDestination = yield (0, NextDestinationRepository_1.updateNextDestination)(Number(id), name, targetDate, userId);
        if (!updatedDestination) {
            throw new Error(`El destino con ID ${id} no existe o no pertenece al usuario.`);
        }
        return updatedDestination;
    });
}
function DeleteNextDestination(id, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const destination = yield (0, NextDestinationRepository_1.getNextDestinationById)(Number(id), userId);
        if (!destination) {
            throw new Error(`El destino con ID ${id} no existe o no pertenece al usuario.`);
        }
        yield (0, NextDestinationRepository_1.deleteNextDestination)(Number(id), userId);
    });
}
