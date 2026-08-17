import { eq, desc, and } from "drizzle-orm";
import db from "@/Db/Client.js";
import { history } from "@/Db/Schema.js";
import { History, HistoryInsert, HistoryUpdate } from "@/Types/database.js";

/**
 * Trip Service
 * Handles database operations for trips using Drizzle ORM.
 */

export const getHistory = async (user_id: string) => {
  const data = await db
    .select()
    .from(history)
    .where(eq(history.user_id, user_id))
    .orderBy(desc(history.created_at));

  return data as History[];
};
