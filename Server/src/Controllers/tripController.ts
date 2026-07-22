import { Response } from "express";
import * as tripService from "@/Service/tripService.js";
import { AuthRequest } from "@/Middleware/auth.js";
import { ValidatedTrip, ValidatedTripUpdate } from "@/Types/validation.js";

/**
 * Trip Controller
 * Handles trip CRUD operations by delegating to TripService.
 */

const handleError = (res: Response, error: unknown, context: string) => {
  console.error(`${context} error:`, error);
  const status = (error as { status?: number })?.status || 500;
  const message =
    (error as { message?: string })?.message || "Internal server error";
  res.status(status).json({ error: message });
};

export const createTrip = async (req: AuthRequest, res: Response) => {
  try {
    const tripData = req.body as ValidatedTrip;
    const userId = req.user?.id;
    const token = req.token;

    if (!userId || !token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const newTrip = await tripService.createTrip(token, {
      ...tripData,
      user_id: userId,
    });

    res.status(201).json(newTrip);
  } catch (error: unknown) {
    handleError(res, error, "CreateTrip");
  }
};

export const getTrips = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const token = req.token;

    if (!userId || !token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const trips = await tripService.getTrips(token, userId);
    res.status(200).json(trips);
  } catch (error: unknown) {
    handleError(res, error, "GetTrips");
  }
};

export const getTripById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const userId = req.user?.id;
    const token = req.token;

    if (!userId || !token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const trip = await tripService.getTripById(token, id, userId);
    res.status(200).json(trip);
  } catch (error: unknown) {
    handleError(res, error, "GetTripById");
  }
};

export const updateTrip = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const tripData = req.body as ValidatedTripUpdate;
    const userId = req.user?.id;
    const token = req.token;

    if (!userId || !token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const updatedTrip = await tripService.updateTrip(
      token,
      id,
      userId,
      tripData,
    );
    res.status(200).json(updatedTrip);
  } catch (error: unknown) {
    handleError(res, error, "UpdateTrip");
  }
};

export const deleteTrip = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const userId = req.user?.id;
    const token = req.token;

    if (!userId || !token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await tripService.deleteTrip(token, id, userId);
    res.status(204).send();
  } catch (error: unknown) {
    handleError(res, error, "DeleteTrip");
  }
};
