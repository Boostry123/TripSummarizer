import { eq, desc, and } from "drizzle-orm";
import db from "@/Db/Client.js";
import { trips } from "@/Db/Schema.js";
import { Trip, TripInsert, TripUpdate } from "@/Types/database.js";

/**
 * Trip Service
 * Handles database operations for trips using Drizzle ORM.
 */

export const createTrip = async (token: string, tripData: TripInsert) => {
  const [data] = await db.insert(trips).values(tripData).returning();

  return data as Trip;
};

export const getTrips = async (token: string, userId: string) => {
  const data = await db
    .select()
    .from(trips)
    .where(eq(trips.user_id, userId))
    .orderBy(desc(trips.created_at));

  return data as Trip[];
};

export const getTripById = async (
  token: string,
  id: string,
  userId: string,
) => {
  const [data] = await db
    .select()
    .from(trips)
    .where(and(eq(trips.id, id), eq(trips.user_id, userId)))
    .limit(1);

  if (!data) throw new Error("Trip not found");
  return data as Trip;
};

export const updateTrip = async (
  token: string,
  id: string,
  userId: string,
  tripData: TripUpdate,
) => {
  const [data] = await db
    .update(trips)
    .set(tripData)
    .where(and(eq(trips.id, id), eq(trips.user_id, userId)))
    .returning();

  if (!data) throw new Error("Trip not found or unauthorized");
  return data as Trip;
};

export const deleteTrip = async (
  token: string,
  id: string,
  userId: string,
) => {
  const [data] = await db
    .delete(trips)
    .where(and(eq(trips.id, id), eq(trips.user_id, userId)))
    .returning();

  if (!data) throw new Error("Trip not found or unauthorized");
  return true;
};

