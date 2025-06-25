import { Location } from "./Location";

export interface JournalEntry {
  id: string;
  userId: string;
  locations: Location[];
  date: Date;
  description: string;
  dailyExpenses: number;
  favorite: string;
  leastFavorite: string;
  score: number;
  imageUrls: string[];
}
