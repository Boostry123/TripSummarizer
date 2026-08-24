import apiClient from "./apiClient";
import type { History } from "@/Types/history";

export const getRecommendation = async (
  message?: string,
  history: { role: string; content: string }[] = [],
  id?: string | null,
) => {
  const response = await apiClient.post("/chat", { message, history, id });
  return response.data.response[0] as History;
};
