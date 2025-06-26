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
exports.searchCity = void 0;
const axios_1 = __importDefault(require("axios"));
const searchCity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Solicitud recibida en /location/search con query:", req.query.query);
    const { query } = req.query;
    if (!query) {
        res.status(400).json({ message: "El parámetro 'query' es requerido" });
        return;
    }
    try {
        const response = yield axios_1.default.get("https://nominatim.openstreetmap.org/search", {
            params: {
                q: query,
                format: "json",
                addressdetails: 1,
                limit: 5,
            },
            headers: {
                "User-Agent": "la-bitacora-viajera/1.0",
            },
        });
        if (!Array.isArray(response.data)) {
            res
                .status(500)
                .json({ message: "La respuesta de OpenStreetMap no es válida" });
            return;
        }
        const results = response.data.map((item) => ({
            name: item.name,
            lat: item.lat,
            lon: item.lon,
        }));
        res.json(results);
    }
    catch (error) {
        res.status(500).json({ message: "Error al buscar ciudad" });
    }
});
exports.searchCity = searchCity;
