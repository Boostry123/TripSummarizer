import express, { Request, Response } from "express";
import cors from "cors";
import authRoutes from "@/Routes/authRoutes.js";
import tripRoutes from "@/Routes/tripRoutes.js";
import chatBotRoutes from "@/Routes/chatBotRoutes.js";
import historyRoutes from "@/Routes/historyRoutes.js";

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost",
  process.env.BASE_FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(
        new Error("CORS policy does not allow access from this origin."),
      );
    },
    credentials: true,
  }),
);
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/trips", tripRoutes);
app.use("/chat", chatBotRoutes);
app.use("/history", historyRoutes);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "TripSummarizer API is running" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
