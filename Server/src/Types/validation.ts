import { z } from "zod";

/**
 * Auth Validation Schemas
 */
export const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const SignupSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
});

/**
 * Profile Validation Schema
 */
export const ProfileSchema = z.object({
  id: z.string().uuid({ message: "Invalid user ID format" }),
  email: z.string().email({ message: "Invalid email address" }),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100)
    .nullable()
    .optional(),
});

/**
 * Trip Validation Schema
 * Matches the 'trips' table structure and TripData interface
 */
export const TripSchema = z.object({
  country: z
    .string()
    .min(1, "Country is required")
    .max(100, "Country name too long"),
  city: z
    .array(z.string().min(1).max(100))
    .min(1, "At least one city is required"),
  travel_date: z
    .string()
    .datetime({ message: "Invalid date format. Expected ISO 8601" })
    .or(
      z
        .string()
        .regex(
          /^\d{4}-\d{2}-\d{2}$/,
          "Invalid date format. Expected YYYY-MM-DD",
        ),
    ),
  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  likes: z.array(z.string().max(200)).default([]),
  hates: z.array(z.string().max(200)).default([]),
  free_text: z
    .string()
    .max(5000, "Story is too long (max 5000 characters)")
    .nullable()
    .optional(),
});

/**
 * Partial schemas for updates
 */
export const TripUpdateSchema = TripSchema.partial();
export const ProfileUpdateSchema = ProfileSchema.partial().omit({
  id: true,
  email: true,
});

// Types inferred from schemas
export type ValidatedTrip = z.infer<typeof TripSchema>;
export type ValidatedTripUpdate = z.infer<typeof TripUpdateSchema>;
export type ValidatedProfile = z.infer<typeof ProfileSchema>;
