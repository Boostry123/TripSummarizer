export interface TripData {
  country: string;
  city: string[];
  travel_date: string; // ISO string or YYYY-MM-DD
  rating: number;
  likes: string[];
  hates: string[];
  free_text?: string;
}

export type TripRating = 1 | 2 | 3 | 4 | 5;

export interface Trip extends TripData {
  id: string;
  user_id: string;
  created_at: string;
}

export type TripInsert = TripData;
export type TripUpdate = Partial<TripData>;
