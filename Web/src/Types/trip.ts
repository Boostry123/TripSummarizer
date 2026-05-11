export interface TripData {
  country: string;
  city: string;
  rating: number;
  likes: string[];
  hates: string[];
  freeText: string;
}

export type TripRating = 1 | 2 | 3 | 4 | 5;

export interface TripExperience extends TripData {
  id?: string;
  userId?: string;
  createdAt?: string;
}
