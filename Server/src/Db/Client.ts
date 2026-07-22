import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing in environment variables");
}

const client = postgres(process.env.DATABASE_URL, { prepare: false });

export const db = drizzle(client);

export default db;
