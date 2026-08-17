import { Router } from "express";
import { authenticate, type AuthRequest } from "@/Middleware/auth.js";
import * as chatBotService from "@/Service/chatBotService.js";
import { Message } from "@/Types/history.js";
import { updateHistory, insertHistory } from "@/Service/historyService.js";

const chatBotRoutes = Router();

chatBotRoutes.post("/", authenticate, async (req: AuthRequest, res) => {
  const token = req.token;
  const userId = req.user?.id;
  const { message, history }: { message: string; history: Message[] } =
    req.body;

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
    const newHistoryData: { user_id: string; chat_history: Message[] } = {
      user_id: userId,
      chat_history: [
        { role: "user", content: message },
        { role: "assistant", content: recommendation },
      ],
    };

    if (history.length < 1) {
      await insertHistory(newHistoryData);

      console.log(newHistoryData);
    }

    res.status(200).json({ recommendation });
  } catch (err: unknown) {
    console.error("ChatBot Route Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default chatBotRoutes;
