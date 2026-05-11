import express, { Request, Response } from "express";
import cors from "cors";
import authRoutes from "@/Routes/authRoutes.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "TripSummarizer API is running" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
