import {
  Profile as DrizzleProfile,
  NewProfile,
  Trip as DrizzleTrip,
  NewTrip,
  History as DrizzleHistory,
  NewHistory,
} from "@/Db/Schema.js";

// Export standard types
export type Profile = DrizzleProfile;
export type ProfileInsert = NewProfile;
export type ProfileUpdate = Partial<NewProfile>;

export type Trip = DrizzleTrip;
export type TripInsert = NewTrip;
export type TripUpdate = Partial<NewTrip>;

export type History = DrizzleHistory;
export type HistoryInsert = NewHistory;
export type HistoryUpdate = Partial<NewHistory>;
