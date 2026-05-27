import { Router } from "express";
import { authenticate, type AuthRequest } from "@/Middleware/auth.js";
import * as chatBotService from "@/Service/chatBotService.js";

const chatBotRoutes = Router();

chatBotRoutes.post("/", authenticate, async (req: AuthRequest, res) => {
  const token = req.token;
  const userId = req.user?.id;
  const { message } = req.body;

  if (!token || !userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const recommendation = await chatBotService.generateRecommendation(
      token,
      userId,
      message,
    );

    res.status(200).json({ recommendation });
  } catch (err: unknown) {
    console.error("ChatBot Route Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default chatBotRoutes;
