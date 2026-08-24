import { Router } from "express";
import { authenticate, type AuthRequest } from "@/Middleware/auth.js";
import * as chatBotService from "@/Service/chatBotService.js";
import { Message } from "@/Types/history.js";
import { updateHistory, insertHistory } from "@/Service/historyService.js";
import { History } from "@/Types/database.js";

const chatBotRoutes = Router();

chatBotRoutes.post("/", authenticate, async (req: AuthRequest, res) => {
  const token = req.token;
  const userId = req.user?.id;
  const {
    message,
    history,
    id,
  }: { message: string; history: Message[]; id?: string } = req.body;

  if (!token || !userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const recommendation = await chatBotService.generateRecommendation(
      token,
      userId,
      message,
      history,
    );
    const currentMessages: Message[] = [
      {
        role: "user",
        content: message || "Generate a recommendation for my next trip.",
      },
      { role: "assistant", content: recommendation },
    ];

    let response: History[] | null = null;
    if (!id) {
      response = await insertHistory({
        user_id: userId,
        chat_history: currentMessages,
      });

      console.log(`inserting new history data for user: ${userId}`);
    } else {
      const updateData = {
        id: id,
        user_id: userId,
        chat_history: currentMessages,
      };
      console.log(`updating history data for id: ${id}`);
      response = await updateHistory(updateData);
    }

    return res.status(200).json({ response });
  } catch (err: unknown) {
    console.error("ChatBot Route Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default chatBotRoutes;
