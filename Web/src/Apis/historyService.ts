import apiClient from "./apiClient";
import { History } from "@/Types/history";

export const getHistory = async (): Promise<History[]> => {
  const response = await apiClient.get<History[]>("/history");
  return response.data;
};

export const deleteHistory = async (id: string): Promise<void> => {
  await apiClient.delete("/history", {
    params: { id },
  });
};
