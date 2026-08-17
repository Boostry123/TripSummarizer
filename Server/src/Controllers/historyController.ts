import { AuthRequest } from "@/Middleware/auth.js";
import { Response } from "express";
import * as historyService from "@/Service/historyService.js";
import { HistoryInsert } from "@/Types/database.js";
import { Messages } from "@/Types/history.js";

/**
 * History Controller
 * Handles trip CRUD operations by delegating to History Services.
 */

const handleError = (res: Response, error: unknown, context: string) => {
  console.error(`${context} error:`, error);
  const status = (error as { status?: number })?.status || 500;
  const message =
    (error as { message?: string })?.message || "Internal server error";
  res.status(status).json({ error: message });
};

export const getHistory = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user?.id;
    const token = req.token;

    if (!user_id || !token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const trips = await historyService.getHistory(user_id);
    res.status(200).json(trips);
  } catch (error: unknown) {
    handleError(res, error, "GetTrips");
  }
};

export const insertHistory = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user?.id;
    const chat_history: Messages = req.body;
    const token = req.token;

    if (!user_id || !token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const dataToInsert: HistoryInsert = { user_id, chat_history };
    const result = await historyService.insertHistory(dataToInsert);
    res.status(200).json(result);
  } catch (error: unknown) {
    handleError(res, error, "GetTrips");
  }
};
