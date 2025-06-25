import { PostgresJournalEntryRepository } from "../../../infrastructure/database/PostgresJournalEntryRepository";
import { JournalEntry } from "../../../domain/entities/JournalEntry";
import { JournalEntryDTO } from "../../../domain/dtos/JournalEntryDTO";
import { v4 as uuid } from "uuid";

export async function CreateJournalEntry(
  input: JournalEntryDTO
): Promise<JournalEntry> {
  const {
    locations,
    date,
    description,
    dailyExpenses,
    favorite,
    leastFavorite,
    score,
    imageUrls,
    userId,
  } = input;

  let processedLocations: any[] = [];
  if (Array.isArray(locations)) {
    processedLocations = locations;
  } else if (locations && typeof locations === "object") {
    processedLocations = [locations];
  } else {
    throw new Error(
      "El campo 'locations' debe ser un array o un objeto válido"
    );
  }

  const parsedDate = new Date(date);

  const newEntry: JournalEntry = {
    id: uuid(),
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

  const repository = new PostgresJournalEntryRepository();
  await repository.save(newEntry);

  return newEntry;
}

export async function GetJournalEntries(): Promise<JournalEntry[]> {
  const repository = new PostgresJournalEntryRepository();

  const entries = await repository.findAll();

  return entries;
}

export async function GetJournalEntryById(
  id: string
): Promise<JournalEntry | null> {
  const repository = new PostgresJournalEntryRepository();

  const entry = await repository.findById(id);

  if (!entry) {
    throw new Error(`La entrada con ID ${id} no existe.`);
  }

  return entry;
}

export async function UpdateJournalEntry(
  id: string,
  input: Partial<JournalEntryDTO>
): Promise<JournalEntry | null> {
  const repository = new PostgresJournalEntryRepository();

  const existingEntry = await repository.findById(id);
  if (!existingEntry) {
    throw new Error(`La entrada con ID ${id} no existe.`);
  }

  const updatedEntry: JournalEntry = {
    ...existingEntry,
    ...input,
    locations: input.locations || existingEntry.locations,
    date: input.date ? new Date(input.date) : existingEntry.date,
  };

  await repository.save(updatedEntry);

  return updatedEntry;
}

export async function DeleteJournalEntry(id: string): Promise<void> {
  const repository = new PostgresJournalEntryRepository();

  const existingEntry = await repository.findById(id);
  if (!existingEntry) {
    throw new Error(`La entrada con ID ${id} no existe.`);
  }

  await repository.delete(id);
}

export async function GetJournalEntriesByUser(
  userId: string
): Promise<JournalEntry[]> {
  const repository = new PostgresJournalEntryRepository();

  const entries = await repository.findByUserId(userId);

  return entries;
}
