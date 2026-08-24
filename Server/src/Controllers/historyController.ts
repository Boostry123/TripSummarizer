import { AuthRequest } from "@/Middleware/auth.js";
import { Response } from "express";
import * as historyService from "@/Service/historyService.js";

/**
 * History Controller
 * Handles history CRUD operations by delegating to History Services.
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

    const history = await historyService.getHistory(user_id);
    res.status(200).json(history);
  } catch (error: unknown) {
    handleError(res, error, "GetHistory");
  }
};

export const deleteHistory = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.query.id as string | undefined;
    const user_id = req.user?.id;
    const token = req.token;

    if (!user_id || !token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!id || typeof id !== "string") {
      return res
        .status(400)
        .json({ error: "History ID query parameter is required" });
    }

    await historyService.deleteHistory(id, user_id);
    res.status(204).send();
  } catch (error: unknown) {
    handleError(res, error, "DeleteHistory");
  }
};
