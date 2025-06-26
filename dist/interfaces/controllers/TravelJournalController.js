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
exports.getJournalEntriesByUserController = exports.deleteJournalEntryController = exports.updateJournalEntryController = exports.getJournalEntryByIdController = exports.getJournalEntriesController = exports.createJournalEntryController = void 0;
const uuid_1 = require("uuid");
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const uuid_2 = require("uuid");
const JournalEntryUseCases_1 = require("../../application/use-cases/travel-journal/JournalEntryUseCases");
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix);
    },
});
const upload = (0, multer_1.default)({ storage });
const createJournalEntryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: "Usuario no autenticado" });
            return;
        }
        const { locations, date, description, dailyExpenses, favorite, leastFavorite, score, } = req.body;
        console.log("Datos recibidos:", req.body); // Log para depurar
        console.log("Archivos recibidos:", req.files); // Log para depurar
        let processedLocations = [];
        try {
            const parsedLocations = JSON.parse(locations); // Parsear locations si es un string
            if (Array.isArray(parsedLocations)) {
                processedLocations = parsedLocations;
            }
            else if (parsedLocations && typeof parsedLocations === "object") {
                processedLocations = [parsedLocations];
            }
            else {
                throw new Error("El campo 'locations' debe ser un array o un objeto válido");
            }
        }
        catch (error) {
            res.status(400).json({
                message: "El campo 'locations' debe ser un array o un objeto válido",
            });
            return;
        }
        // Subir imágenes a Cloudinary
        const imageUrls = [];
        if (req.files) {
            for (const file of req.files) {
                const result = yield cloudinary_1.v2.uploader.upload(file.path, {
                    folder: "bitacora-viajera",
                    fetch_format: "auto",
                });
                imageUrls.push(result.secure_url); // Guardar la URL segura de la imagen
            }
        }
        const newEntry = {
            id: (0, uuid_1.v4)(),
            userId,
            locations: processedLocations,
            date,
            description,
            dailyExpenses,
            favorite,
            leastFavorite,
            score,
            imageUrls,
        };
        const savedEntry = yield (0, JournalEntryUseCases_1.CreateJournalEntry)(newEntry);
        res.status(201).json(savedEntry);
    }
    catch (error) {
        console.error("Error al crear la entrada de la bitácora:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});
exports.createJournalEntryController = createJournalEntryController;
const getJournalEntriesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const entries = yield (0, JournalEntryUseCases_1.GetJournalEntries)();
        res.status(200).json(entries);
    }
    catch (error) {
        console.error("Error al obtener las entradas de la bitácora:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});
exports.getJournalEntriesController = getJournalEntriesController;
const getJournalEntryByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log("ID recibido en el controlador:", id);
        if (!id) {
            res.status(400).json({ message: "El parámetro 'id' es requerido" });
            return;
        }
        const entry = yield (0, JournalEntryUseCases_1.GetJournalEntryById)(id);
        res.status(200).json(entry);
    }
    catch (error) {
        console.error("Error al obtener la entrada de la bitácora:", error);
        res.status(404).json({ message: error });
    }
});
exports.getJournalEntryByIdController = getJournalEntryByIdController;
const updateJournalEntryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log("ID recibido para actualizar:", id);
        const updates = req.body;
        console.log("Datos recibidos en el cuerpo:", req.body);
        console.log("Archivos recibidos:", req.files);
        if (!id) {
            res.status(400).json({ message: "El parámetro 'id' es requerido" });
            return;
        }
        if (!(0, uuid_2.validate)(id)) {
            res
                .status(400)
                .json({ message: "El ID proporcionado no es un UUID válido" });
            return;
        }
        // Validar si updates existe antes de procesar locations
        if (!updates) {
            res.status(400).json({
                message: "El cuerpo de la solicitud está vacío o es inválido",
            });
            return;
        }
        // Procesar locations
        let processedLocations = [];
        if (updates.locations) {
            try {
                const parsedLocations = JSON.parse(updates.locations); // Parsear locations si es un string
                if (Array.isArray(parsedLocations)) {
                    processedLocations = parsedLocations;
                }
                else if (parsedLocations && typeof parsedLocations === "object") {
                    processedLocations = [parsedLocations];
                }
                else {
                    throw new Error("El campo 'locations' debe ser un array o un objeto válido");
                }
            }
            catch (error) {
                res.status(400).json({
                    message: "El campo 'locations' debe ser un array o un objeto válido",
                });
                return;
            }
        }
        // Subir imágenes a Cloudinary
        const imageUrls = [];
        if (req.files && Array.isArray(req.files)) {
            for (const file of req.files) {
                try {
                    const result = yield cloudinary_1.v2.uploader.upload(file.path, {
                        folder: "bitacora-viajera",
                        fetch_format: "auto",
                    });
                    imageUrls.push(result.secure_url); // Guardar la URL segura de la imagen
                }
                catch (error) {
                    console.error("Error al subir la imagen a Cloudinary:", error);
                    res.status(500).json({
                        message: "Error al subir las imágenes",
                    });
                    return;
                }
            }
        }
        const updatedEntry = yield (0, JournalEntryUseCases_1.UpdateJournalEntry)(id, Object.assign(Object.assign({}, updates), { locations: processedLocations.length > 0 ? processedLocations : undefined, imageUrls: imageUrls.length > 0 ? imageUrls : undefined }));
        res.status(200).json(updatedEntry);
    }
    catch (error) {
        console.error("Error al actualizar la entrada de la bitácora:", error);
        res.status(404).json({ message: error });
    }
});
exports.updateJournalEntryController = updateJournalEntryController;
const deleteJournalEntryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ message: "El parámetro 'id' es requerido" });
            return;
        }
        yield (0, JournalEntryUseCases_1.DeleteJournalEntry)(id);
        res.status(204).send();
    }
    catch (error) {
        console.error("Error al eliminar la entrada de la bitácora:", error);
        res.status(404).json({ message: error });
    }
});
exports.deleteJournalEntryController = deleteJournalEntryController;
const getJournalEntriesByUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log("Entrando al controlador getJournalEntriesByUserController");
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        console.log("Usuario autenticado:", req.user);
        if (!userId) {
            res.status(401).json({ message: "Usuario no autenticado" });
            return;
        }
        const entries = yield (0, JournalEntryUseCases_1.GetJournalEntriesByUser)(userId);
        res.status(200).json(entries);
    }
    catch (error) {
        console.error("Error al obtener las entradas de la bitácora por usuario:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});
exports.getJournalEntriesByUserController = getJournalEntriesByUserController;
