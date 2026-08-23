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

export const insertHistory = async (H: HistoryInsert) => {
  const data = await db.insert(history).values(H).returning();
  return data as History[];
};

export const updateHistory = async (H: HistoryUpdate) => {
  const { id: recId, user_id } = H;

  if (!recId || !user_id) {
    throw new Error("Missing required fields: id or user_id");
  }
  const updated_at = new Date().toISOString();

  const data = await db
    .update(history)
    .set({ chat_history: H.chat_history, updated_at: updated_at })
    .where(and(eq(history.id, recId), eq(history.user_id, user_id)))
    .returning();

  return data;
};
