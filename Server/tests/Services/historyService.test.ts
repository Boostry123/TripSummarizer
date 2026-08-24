import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getHistory,
  insertHistory,
  updateHistory,
  deleteHistory,
} from "@/Service/historyService.js";
import db from "@/Db/Client.js";
import { Messages } from "@/Types/history.js";

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

describe("historyService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getHistory", () => {
    it("should retrieve and order history for a user successfully", async () => {
      const mockHistory = [
        {
          id: "hist-1",
          user_id: "user-123",
          chat_history: [
            { role: "user", content: "hello" },
            { role: "assistant", content: "world" },
          ] as Messages,
          created_at: "2026-01-01T00:00:00.000Z",
          updated_at: "2026-01-01T00:00:00.000Z",
        },
      ];

      const mockOrderBy = vi.fn().mockResolvedValue(mockHistory);
      const mockWhere = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
      const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });

      vi.mocked(db.select).mockReturnValue({
        from: mockFrom,
      } as unknown as ReturnType<typeof db.select>);

      const result = await getHistory("user-123");

      expect(result).toEqual(mockHistory);
      expect(db.select).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalled();
      expect(mockWhere).toHaveBeenCalled();
      expect(mockOrderBy).toHaveBeenCalled();
    });
  });

  describe("insertHistory", () => {
    it("should insert history and return inserted records", async () => {
      const newHistory = {
        user_id: "user-123",
        chat_history: [{ role: "user" as const, content: "hi" }],
      };
      const inserted = [{ id: "hist-1", ...newHistory, created_at: "now", updated_at: "now" }];

      const mockReturning = vi.fn().mockResolvedValue(inserted);
      const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });

      vi.mocked(db.insert).mockReturnValue({
        values: mockValues,
      } as unknown as ReturnType<typeof db.insert>);

      const result = await insertHistory(newHistory);

      expect(result).toEqual(inserted);
      expect(db.insert).toHaveBeenCalled();
      expect(mockValues).toHaveBeenCalledWith(newHistory);
      expect(mockReturning).toHaveBeenCalled();
    });
  });

  describe("updateHistory", () => {
    it("should update history and return updated records", async () => {
      const updateData = {
        id: "hist-1",
        user_id: "user-123",
        chat_history: [{ role: "user" as const, content: "updated" }],
      };
      const updated = [{ ...updateData, created_at: "old", updated_at: "new" }];

      const mockReturning = vi.fn().mockResolvedValue(updated);
      const mockWhere = vi.fn().mockReturnValue({ returning: mockReturning });
      const mockSet = vi.fn().mockReturnValue({ where: mockWhere });

      vi.mocked(db.update).mockReturnValue({
        set: mockSet,
      } as unknown as ReturnType<typeof db.update>);

      const result = await updateHistory(updateData);

      expect(result).toEqual(updated);
      expect(db.update).toHaveBeenCalled();
      expect(mockSet).toHaveBeenCalled();
      expect(mockWhere).toHaveBeenCalled();
      expect(mockReturning).toHaveBeenCalled();
    });

    it("should throw error if id or user_id is missing", async () => {
      await expect(
        updateHistory({
          user_id: "user-123",
          chat_history: [],
        } as unknown as { id: string; user_id: string; chat_history: Messages }),
      ).rejects.toThrow("Missing required fields: id or user_id");
    });
  });

  describe("deleteHistory", () => {
    it("should delete history successfully when record exists", async () => {
      const mockReturning = vi.fn().mockResolvedValue([{ id: "hist-1" }]);
      const mockWhere = vi.fn().mockReturnValue({ returning: mockReturning });

      vi.mocked(db.delete).mockReturnValue({
        where: mockWhere,
      } as unknown as ReturnType<typeof db.delete>);

      const result = await deleteHistory("hist-1", "user-123");

      expect(result).toBe(true);
      expect(db.delete).toHaveBeenCalled();
      expect(mockWhere).toHaveBeenCalled();
      expect(mockReturning).toHaveBeenCalled();
    });

    it("should throw an error if history record is not found or unauthorized", async () => {
      const mockReturning = vi.fn().mockResolvedValue([]);
      const mockWhere = vi.fn().mockReturnValue({ returning: mockReturning });

      vi.mocked(db.delete).mockReturnValue({
        where: mockWhere,
      } as unknown as ReturnType<typeof db.delete>);

      await expect(deleteHistory("hist-999", "user-123")).rejects.toThrow(
        "History not found or unauthorized",
      );
    });
  });
});
