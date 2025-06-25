import { Location } from "../entities/Location";

export interface JournalEntryDTO {
  locations: Location[];
  date: string;
  description: string;
  dailyExpenses: number;
  favorite: string;
  leastFavorite: string;
  score: number;
  imageUrls: string[];
  userId: string;
}
