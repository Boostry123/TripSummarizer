import { describe, it, expect, vi, beforeEach } from "vitest";
import { getTrips } from "@/Service/tripService.js";
import { getSupabaseClient } from "@/Config/Db.js";

vi.mock("@/Config/Db.js", () => {
  return {
    getSupabaseClient: vi.fn(),
  };
});

describe("tripService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getTrips", () => {
    it("should retrive and order trips for a user successfully", async () => {
      const mockTrips = [
        {
          id: 1,
          user_id: "user-123",
          country: "Japan",
          City: ["Tokyo"],
          travel_date: "2023-01-01",
        },
        {
          id: 2,
          user_id: "user-123",
          country: "Italy",
          City: ["Rome"],
          travel_date: "2023-02-01",
        },
      ];

      const mockOrder = vi
        .fn()
        .mockResolvedValue({ data: mockTrips, error: null });
      const mockEq = vi.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

      const mockSupabaseClient = {
        from: mockFrom,
      };

      vi.mocked(getSupabaseClient).mockReturnValue(
        mockSupabaseClient as unknown as ReturnType<typeof getSupabaseClient>,
      );
      const token = "fake-token";
      const userId = "user-123";
      const result = await getTrips(token, userId);

      expect(result).toEqual(mockTrips);

      expect(getSupabaseClient).toHaveBeenCalledWith(token);

      expect(mockFrom).toHaveBeenCalledWith("trips");
      expect(mockSelect).toHaveBeenCalledWith("*");
      expect(mockEq).toHaveBeenCalledWith("user_id", userId);
      expect(mockOrder).toHaveBeenCalledWith("created_at", {
        ascending: false,
      });
    });
  });

  it("should throw an error if the Supabase query fails", async () => {
    const mockError = new Error("Database query failed");

    const mockOrder = vi
      .fn()
      .mockResolvedValue({ data: null, error: mockError });
    const mockEq = vi.fn().mockReturnValue({ order: mockOrder });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

    const mockSupabaseClient = { from: mockFrom };
    vi.mocked(getSupabaseClient).mockReturnValue(
      mockSupabaseClient as unknown as ReturnType<typeof getSupabaseClient>,
    );
    const token = "fake-token";
    const userId = "user-123";
    await expect(getTrips(token, userId)).rejects.toThrow(
      "Database query failed",
    );
  });
});
