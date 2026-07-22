import {
  pgTable,
  uuid,
  text,
  smallint,
  date,
  timestamp,
} from "drizzle-orm/pg-core";

//Profiles Table
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().notNull(),
  name: text("name"),
  email: text("email").unique().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
});

// Trips table
export const trips = pgTable("trips", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  user_id: uuid("user_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  country: text("country").notNull(),
  city: text("city").array().notNull(),
  travel_date: date("travel_date").notNull(), // YYYY-MM-DD format
  rating: smallint("rating").notNull(), // Constraint 1-5
  likes: text("likes").array().default([]).notNull(), // text[] mapping for string[]
  hates: text("hates").array().default([]).notNull(), // text[] mapping for string[]
  free_text: text("free_text"),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
});

// TypeScript inference types for query output and insertion
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;

export type Trip = typeof trips.$inferSelect;
export type NewTrip = typeof trips.$inferInsert;
