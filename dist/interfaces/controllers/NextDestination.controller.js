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
exports.deleteNextDestination = exports.updateNextDestination = exports.createNextDestination = exports.getNextDestinationById = exports.getMyNextDestinations = void 0;
const NextDestinationUseCases_1 = require("../../application/use-cases/next-destination/NextDestinationUseCases");
const getMyNextDestinations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: "Usuario no autenticado" });
            return;
        }
        const destinations = yield (0, NextDestinationUseCases_1.GetNextDestinationsByUser)(userId);
        res.status(200).json(destinations);
    }
    catch (error) {
        console.error("Error fetching next destinations:", error);
        res.status(500).json({ message: "Error fetching next destinations" });
    }
});
exports.getMyNextDestinations = getMyNextDestinations;
const getNextDestinationById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const destinationId = req.params.id;
        if (!destinationId) {
            res.status(400).json({ message: "El ID del destino es requerido" });
            return;
        }
        const destination = yield (0, NextDestinationUseCases_1.GetNextDestinationById)(destinationId, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        if (!destination) {
            return res.status(404).json({ message: "Destination not found" });
        }
        res.status(200).json(destination);
    }
    catch (error) {
        console.error(`Error fetching destination with id ${req.params.id}:`, error);
        res.status(500).json({ message: "Error fetching destination" });
    }
});
exports.getNextDestinationById = getNextDestinationById;
const createNextDestination = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: "Usuario no autenticado" });
            return;
        }
        const { name, targetDate } = req.body;
        const nextDestinationDTO = {
            name,
            targetDate: new Date(targetDate),
            createdDate: new Date(),
        };
        const newDestination = yield (0, NextDestinationUseCases_1.CreateNextDestination)(nextDestinationDTO.name, nextDestinationDTO.targetDate, nextDestinationDTO.createdDate, userId);
        res.status(201).json(newDestination);
    }
    catch (error) {
        console.error("Error al crear el destino:", error);
        res.status(500).json({ message: "Error al crear el destino" });
    }
});
exports.createNextDestination = createNextDestination;
const updateNextDestination = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: "Usuario no autenticado" });
            return;
        }
        const { name, targetDate } = req.body;
        const nextDestinationDTO = {
            name,
            targetDate: new Date(targetDate),
            createdDate: new Date(),
        };
        const updatedDestination = yield (0, NextDestinationUseCases_1.UpdateNextDestination)(req.params.id, nextDestinationDTO.name, nextDestinationDTO.targetDate, userId);
        if (!updatedDestination) {
            return res.status(404).json({ message: "Destination not found" });
        }
        res.status(200).json(updatedDestination);
    }
    catch (error) {
        console.error(`Error updating destination with id ${req.params.id}:`, error);
        res.status(500).json({ message: "Error updating destination" });
    }
});
exports.updateNextDestination = updateNextDestination;
const deleteNextDestination = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: "Usuario no autenticado" });
            return;
        }
        yield (0, NextDestinationUseCases_1.DeleteNextDestination)(req.params.id, userId);
        res.status(200).json({ message: "Destination deleted successfully" });
    }
    catch (error) {
        console.error(`Error deleting destination with id ${req.params.id}:`, error);
        res.status(500).json({ message: "Error deleting destination" });
    }
});
exports.deleteNextDestination = deleteNextDestination;
