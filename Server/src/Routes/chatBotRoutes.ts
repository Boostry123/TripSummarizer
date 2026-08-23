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
    const newHistoryData: {
      user_id: string;
      chat_history: Message[];
      id?: string;
    } = {
      id: id,
      user_id: userId,
      chat_history: [
        { role: "user", content: message },
        { role: "assistant", content: recommendation },
      ],
    };
    let response: History[] | null = null;
    if (history.length < 1) {
      response = await insertHistory(newHistoryData);

      console.log(
        `inserting new history data: ${JSON.stringify(newHistoryData)}`,
      );
    } else {
      console.log(`updating history data: ${JSON.stringify(newHistoryData)}`);
      response = await updateHistory(newHistoryData);
    }

    return res.status(200).json({ response });
  } catch (err: unknown) {
    console.error("ChatBot Route Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default chatBotRoutes;
