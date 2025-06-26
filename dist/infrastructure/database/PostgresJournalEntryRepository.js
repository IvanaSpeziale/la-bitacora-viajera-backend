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
exports.PostgresJournalEntryRepository = void 0;
const db_1 = __importDefault(require("./db"));
const uuid_1 = require("uuid");
class PostgresJournalEntryRepository {
    save(entry) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
      INSERT INTO journal_entries (
        id, locations, date, description, dailyexpenses, 
        favorite, leastfavorite, score, imageurls, userid
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (id) DO UPDATE SET
        locations = EXCLUDED.locations,
        date = EXCLUDED.date,
        description = EXCLUDED.description,
        dailyexpenses = EXCLUDED.dailyexpenses,
        favorite = EXCLUDED.favorite,
        leastfavorite = EXCLUDED.leastfavorite,
        score = EXCLUDED.score,
        imageurls = EXCLUDED.imageurls,
        userid = EXCLUDED.userid
    `;
            const values = [
                entry.id,
                JSON.stringify(entry.locations),
                entry.date,
                entry.description,
                entry.dailyExpenses,
                entry.favorite,
                entry.leastFavorite,
                entry.score,
                JSON.stringify(entry.imageUrls),
                entry.userId,
            ];
            try {
                yield db_1.default.query(query, values);
            }
            catch (error) {
                console.error("Error ejecutando la consulta:", error);
                throw new Error("Error al guardar la entrada en la base de datos");
            }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, uuid_1.validate)(id)) {
                throw new Error(`El ID proporcionado (${id}) no es un UUID válido.`);
            }
            const query = `SELECT * FROM journal_entries WHERE id = $1`;
            const result = yield db_1.default.query(query, [id]);
            if (result.rows.length === 0) {
                return null;
            }
            const row = result.rows[0];
            let parsedLocations = [];
            let parsedImageUrls = [];
            try {
                parsedLocations = Array.isArray(row.locations)
                    ? row.locations
                    : JSON.parse(row.locations);
            }
            catch (error) {
                console.error("Error al parsear 'locations':", error);
            }
            try {
                parsedImageUrls = Array.isArray(row.imageurls)
                    ? row.imageurls
                    : JSON.parse(row.imageurls);
            }
            catch (error) {
                console.error("Error al parsear 'imageUrls':", error);
            }
            return {
                id: row.id,
                userId: row.userid, // camelCase en JS, lowercase en BD
                locations: parsedLocations,
                date: row.date,
                description: row.description,
                dailyExpenses: parseFloat(row.dailyexpenses), // lowercase desde BD
                favorite: row.favorite,
                leastFavorite: row.leastfavorite,
                score: row.score,
                imageUrls: parsedImageUrls,
            };
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
      SELECT id, locations, date, description, dailyexpenses, favorite, leastfavorite, score, imageurls, userid
      FROM journal_entries
    `;
            try {
                const result = yield db_1.default.query(query);
                console.log("Datos obtenidos de la base de datos:", result.rows);
                return result.rows.map((row) => {
                    let parsedLocations = [];
                    let parsedImageUrls = [];
                    try {
                        parsedLocations = Array.isArray(row.locations)
                            ? row.locations
                            : JSON.parse(row.locations);
                    }
                    catch (error) {
                        console.error("Error al parsear 'locations':", error);
                    }
                    try {
                        parsedImageUrls = Array.isArray(row.imageurls)
                            ? row.imageurls
                            : JSON.parse(row.imageurls);
                    }
                    catch (error) {
                        console.error("Error al parsear 'imageUrls':", error);
                    }
                    return {
                        id: row.id,
                        userId: row.userid,
                        locations: parsedLocations,
                        date: row.date,
                        description: row.description,
                        dailyExpenses: parseFloat(row.dailyexpenses),
                        favorite: row.favorite,
                        leastFavorite: row.leastfavorite,
                        score: row.score,
                        imageUrls: parsedImageUrls,
                    };
                });
            }
            catch (error) {
                console.error("Error ejecutando la consulta:", error);
                throw new Error("Error al obtener las entradas de la bitácora");
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `DELETE FROM journal_entries WHERE id = $1`;
            try {
                const result = yield db_1.default.query(query, [id]);
                if (result.rowCount === 0) {
                    throw new Error(`No se encontró la entrada con ID ${id} para eliminar.`);
                }
            }
            catch (error) {
                console.error("Error ejecutando la consulta:", error);
                throw new Error("Error al eliminar la entrada de la base de datos");
            }
        });
    }
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT * FROM journal_entries WHERE userid = $1`;
            const result = yield db_1.default.query(query, [userId]);
            return result.rows.map((row) => {
                let parsedLocations = [];
                let parsedImageUrls = [];
                try {
                    parsedLocations = Array.isArray(row.locations)
                        ? row.locations
                        : JSON.parse(row.locations);
                }
                catch (error) {
                    console.error("Error al parsear 'locations':", error);
                }
                try {
                    parsedImageUrls = Array.isArray(row.imageurls)
                        ? row.imageurls
                        : JSON.parse(row.imageurls);
                }
                catch (error) {
                    console.error("Error al parsear 'imageUrls':", error);
                }
                return {
                    id: row.id,
                    userId: row.userid,
                    locations: parsedLocations,
                    date: row.date,
                    description: row.description,
                    dailyExpenses: parseFloat(row.dailyexpenses),
                    favorite: row.favorite,
                    leastFavorite: row.leastfavorite,
                    score: row.score,
                    imageUrls: parsedImageUrls,
                };
            });
        });
    }
}
exports.PostgresJournalEntryRepository = PostgresJournalEntryRepository;
