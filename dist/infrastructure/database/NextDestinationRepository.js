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
exports.deleteNextDestination = exports.updateNextDestination = exports.createNextDestination = exports.getNextDestinationById = exports.getNextDestinationsByUser = exports.createNextDestinationTable = void 0;
// const pool = require("./db");
const db_1 = __importDefault(require("./db"));
const createNextDestinationTable = () => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.query(`
    CREATE TABLE IF NOT EXISTS next_destinations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      target_date TIMESTAMP NOT NULL
    );
  `);
});
exports.createNextDestinationTable = createNextDestinationTable;
const getNextDestinationsByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.default.query("SELECT * FROM next_destinations WHERE user_id = $1;", [userId]);
    return result.rows.map((row) => ({
        id: row.id,
        name: row.name,
        targetDate: new Date(row.target_date),
        createdDate: new Date(row.created_date),
    }));
});
exports.getNextDestinationsByUser = getNextDestinationsByUser;
const getNextDestinationById = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.default.query("SELECT * FROM next_destinations WHERE id = $1 AND user_id = $2;", [id, userId]);
    if (result.rows.length === 0) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row.id,
        name: row.name,
        targetDate: new Date(row.target_date),
        createdDate: new Date(row.created_date),
    };
});
exports.getNextDestinationById = getNextDestinationById;
const createNextDestination = (name, targetDate, createdDate, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.default.query("INSERT INTO next_destinations (name, target_date, created_date, user_id) VALUES ($1, $2, $3, $4) RETURNING *;", [name, targetDate, createdDate, userId]);
    const row = result.rows[0];
    return {
        id: row.id,
        name: row.name,
        targetDate: new Date(row.target_date),
        createdDate: new Date(row.created_date),
    };
});
exports.createNextDestination = createNextDestination;
const updateNextDestination = (id, name, targetDate, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.default.query("UPDATE next_destinations SET name = $1, target_date = $2 WHERE id = $3 AND user_id = $4 RETURNING *;", [name, targetDate, id, userId]);
    if (result.rows.length === 0) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row.id,
        name: row.name,
        targetDate: new Date(row.target_date),
        createdDate: new Date(row.created_date),
    };
});
exports.updateNextDestination = updateNextDestination;
const deleteNextDestination = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.query("DELETE FROM next_destinations WHERE id = $1 AND user_id = $2;", [id, userId]);
});
exports.deleteNextDestination = deleteNextDestination;
