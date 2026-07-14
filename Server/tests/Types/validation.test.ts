import { describe, it, expect } from "vitest";
import { LoginSchema, TripSchema } from "../../src/Types/validation.js";

describe("loginSchema", () => {
  // Test case for valid input
  it("should validate a correct login payload", () => {
    const payload = {
      email: "test@example.com",
      password: "password123",
    };

    const result = LoginSchema.safeParse(payload);

    expect(result.success).toBe(true);
  });

  it("should fail validadtion for an invalid email", () => {
    const payload = {
      email: "invalid-email",
      password: "password123",
    };

    const result = LoginSchema.safeParse(payload);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Invalid email address");
    }
  });

  it("should fail validation for a short password", () => {
    const payload = {
      email: "test@example.com",
      password: "123",
    };

    const result = LoginSchema.safeParse(payload);

    expect(result.success).toBe(false);
  });
});

describe("TripSchema", () => {
  const getValidTrip = () => ({
    country: "Japan",
    city: ["Tokyo", "Kyoto"],
    travel_date: "2024-01-01",
    rating: 5,
    likes: ["sushi", "temples"],
    hates: ["crowds"],
    free_text: "Had a great time exploring the culture and food!",
  });

  it("should validate a correct trip payload", () => {
    const payload = getValidTrip();
    const result = TripSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });
  describe("required fields validation", () => {
    it("should fail if the country is empty", () => {
      const payload = getValidTrip();
      payload.country = "";

      const result = TripSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Country is required");
      }
    });

    it("should fail if the city array is empty", () => {
      const payload = getValidTrip();
      payload.city = [];

      expect(TripSchema.safeParse(payload).success).toBe(false);
      const result = TripSchema.safeParse(payload);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "At least one city is required",
        );
      }
    });
  });
  describe("travel_date validation", () => {
    it("should pass if the travel_date is in YYYY-MM-DD format", () => {
      const payload = getValidTrip();
      const result = TripSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });
    it("should pass if the travel_date is in ISO 8601 format", () => {
      const payload = getValidTrip();
      payload.travel_date = "2024-01-01T00:00:00Z"; // ISO 8601 format
      const reult = TripSchema.safeParse(payload);
      expect(reult.success).toBe(true);
    });
    it("should fail if the travel_date is in an invalid format", () => {
      const payload = getValidTrip();
      payload.travel_date = "01-01-2024"; // Invalid format\
      const result = TripSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe("rating validation", () => {
    it("should fail if the rating is less than 1", () => {
      const payload = getValidTrip();
      payload.rating = 0;
      const result = TripSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
    it("should fail if the rating is greater than 5", () => {
      const payload = getValidTrip();
      payload.rating = 6;
      const result = TripSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
    it("should fail if the rating is not an integer", () => {
      const payload = getValidTrip();
      payload.rating = 4.5;
      const result = TripSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });
});
