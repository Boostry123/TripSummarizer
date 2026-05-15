import { Router } from 'express';
import * as tripController from '@/Controllers/tripController.js';
import { authenticate } from '@/Middleware/auth.js';
import { validate } from '@/Middleware/validate.js';
import { TripSchema, TripUpdateSchema } from '@/Types/validation.js';

const router = Router();

// Create a new trip
router.post('/', authenticate, validate(TripSchema), tripController.createTrip);

// Get all trips for the authenticated user
router.get('/', authenticate, tripController.getTrips);

// Get a specific trip by ID
router.get('/:id', authenticate, tripController.getTripById);

// Update a trip by ID
router.patch('/:id', authenticate, validate(TripUpdateSchema), tripController.updateTrip);

// Delete a trip by ID
router.delete('/:id', authenticate, tripController.deleteTrip);

export default router;
