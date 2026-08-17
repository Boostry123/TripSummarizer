import apiClient from "./apiClient";
import { History } from "@/Types/history";
import { Message } from "@/store/recommendationStore";

export const getHistory = async (): Promise<History[]> => {
  const response = await apiClient.get<History[]>("/history");
  return response.data;
};

export const insertHistory = async () => {
  const response = await apiClient.post<Partial<History>>("/history");
  return response.data;
};

export const updateHistory = async (id: string, chat_history: Message[]) => {
  const updateDate = { id: id, chat_history: chat_history };
  const response = await apiClient.patch<History>("/history", updateDate);
  return response.data;
};
