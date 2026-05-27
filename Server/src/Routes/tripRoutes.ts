import { Router } from "express";
import * as tripController from "@/Controllers/tripController.js";
import { authenticate } from "@/Middleware/auth.js";
import { validate } from "@/Middleware/validate.js";
import { TripSchema, TripUpdateSchema } from "@/Types/validation.js";

const tripRoutes = Router();

// Create a new trip
tripRoutes.post(
  "/",
  authenticate,
  validate(TripSchema),
  tripController.createTrip,
);

// Get all trips for the authenticated user
tripRoutes.get("/", authenticate, tripController.getTrips);

// Get a specific trip by ID
tripRoutes.get("/:id", authenticate, tripController.getTripById);

// Update a trip by ID
tripRoutes.patch(
  "/:id",
  authenticate,
  validate(TripUpdateSchema),
  tripController.updateTrip,
);

// Delete a trip by ID
tripRoutes.delete("/:id", authenticate, tripController.deleteTrip);

export default tripRoutes;
