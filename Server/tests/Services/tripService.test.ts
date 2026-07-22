import { describe, it, expect, vi, beforeEach } from "vitest";
import { getTrips } from "@/Service/tripService.js";
import db from "@/Db/Client.js";

// Mock the Drizzle client
vi.mock("@/Db/Client.js", () => {
  return {
    db: {
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    default: {
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };
});

describe("tripService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getTrips", () => {
    it("should retrieve and order trips for a user successfully", async () => {
      const mockTrips = [
        {
          id: "trip-1",
          user_id: "user-123",
          country: "Japan",
          city: ["Tokyo"],
          travel_date: "2023-01-01",
          rating: 5,
          likes: [],
          hates: [],
          free_text: null,
          created_at: "2023-01-01T00:00:00.000Z",
        },
      ];

      // Mock the chained Drizzle query: db.select().from(trips).where(...).orderBy(...)
      const mockOrderBy = vi.fn().mockResolvedValue(mockTrips);
      const mockWhere = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
      const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });

      vi.mocked(db.select).mockReturnValue({
        from: mockFrom,
      } as unknown as ReturnType<typeof db.select>);

      const token = "fake-token";
      const userId = "user-123";
      const result = await getTrips(token, userId);

      expect(result).toEqual(mockTrips);
      expect(db.select).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalled();
      expect(mockWhere).toHaveBeenCalled();
      expect(mockOrderBy).toHaveBeenCalled();
    });

    it("should throw an error if the Drizzle query fails", async () => {
      const mockError = new Error("Database query failed");

      const mockOrderBy = vi.fn().mockRejectedValue(mockError);
      const mockWhere = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
      const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });

      vi.mocked(db.select).mockReturnValue({
        from: mockFrom,
      } as unknown as ReturnType<typeof db.select>);

      const token = "fake-token";
      const userId = "user-123";

      await expect(getTrips(token, userId)).rejects.toThrow(
        "Database query failed",
      );
    });
  });
});
