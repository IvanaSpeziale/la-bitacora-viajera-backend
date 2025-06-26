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
exports.CreateJournalEntry = CreateJournalEntry;
exports.GetJournalEntries = GetJournalEntries;
exports.GetJournalEntryById = GetJournalEntryById;
exports.UpdateJournalEntry = UpdateJournalEntry;
exports.DeleteJournalEntry = DeleteJournalEntry;
exports.GetJournalEntriesByUser = GetJournalEntriesByUser;
const PostgresJournalEntryRepository_1 = require("../../../infrastructure/database/PostgresJournalEntryRepository");
const uuid_1 = require("uuid");
function CreateJournalEntry(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const { locations, date, description, dailyExpenses, favorite, leastFavorite, score, imageUrls, userId, } = input;
        let processedLocations = [];
        if (Array.isArray(locations)) {
            processedLocations = locations;
        }
        else if (locations && typeof locations === "object") {
            processedLocations = [locations];
        }
        else {
            throw new Error("El campo 'locations' debe ser un array o un objeto válido");
        }
        const parsedDate = new Date(date);
        const newEntry = {
            id: (0, uuid_1.v4)(),
            locations: processedLocations,
            date: parsedDate,
            description,
            dailyExpenses,
            favorite,
            leastFavorite,
            score,
            imageUrls,
            userId,
        };
        const repository = new PostgresJournalEntryRepository_1.PostgresJournalEntryRepository();
        yield repository.save(newEntry);
        return newEntry;
    });
}
function GetJournalEntries() {
    return __awaiter(this, void 0, void 0, function* () {
        const repository = new PostgresJournalEntryRepository_1.PostgresJournalEntryRepository();
        const entries = yield repository.findAll();
        return entries;
    });
}
function GetJournalEntryById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const repository = new PostgresJournalEntryRepository_1.PostgresJournalEntryRepository();
        const entry = yield repository.findById(id);
        if (!entry) {
            throw new Error(`La entrada con ID ${id} no existe.`);
        }
        return entry;
    });
}
function UpdateJournalEntry(id, input) {
    return __awaiter(this, void 0, void 0, function* () {
        const repository = new PostgresJournalEntryRepository_1.PostgresJournalEntryRepository();
        const existingEntry = yield repository.findById(id);
        if (!existingEntry) {
            throw new Error(`La entrada con ID ${id} no existe.`);
        }
        const updatedEntry = Object.assign(Object.assign(Object.assign({}, existingEntry), input), { locations: input.locations || existingEntry.locations, date: input.date ? new Date(input.date) : existingEntry.date });
        yield repository.save(updatedEntry);
        return updatedEntry;
    });
}
function DeleteJournalEntry(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const repository = new PostgresJournalEntryRepository_1.PostgresJournalEntryRepository();
        const existingEntry = yield repository.findById(id);
        if (!existingEntry) {
            throw new Error(`La entrada con ID ${id} no existe.`);
        }
        yield repository.delete(id);
    });
}
function GetJournalEntriesByUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const repository = new PostgresJournalEntryRepository_1.PostgresJournalEntryRepository();
        const entries = yield repository.findByUserId(userId);
        return entries;
    });
}
