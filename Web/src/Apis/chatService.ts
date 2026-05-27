import apiClient from "./apiClient";

export const getRecommendation = async (message?: string) => {
  const response = await apiClient.post("/chat", { message });
  return response.data.recommendation;
};
