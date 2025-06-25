import { JournalEntry } from "../entities/JournalEntry";

export interface JournalEntryRepository {
  save(entry: JournalEntry): Promise<void>;
  findById(id: string): Promise<JournalEntry | null>;
  findAll(): Promise<JournalEntry[]>;
}
