import { Router } from "express";
import { authenticate } from "@/Middleware/auth.js";
import * as historyController from "@/Controllers/historyController.js";

const historyRoutes = Router();

//Get all history of a specific user by user_id
historyRoutes.get("/", authenticate, historyController.getHistory);

// Delete a history entry by query param (?id=...)
historyRoutes.delete("/", authenticate, historyController.deleteHistory);

export default historyRoutes;
