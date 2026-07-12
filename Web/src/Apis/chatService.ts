import apiClient from "./apiClient";

export const getRecommendation = async (
  message?: string,
  history: { role: string; content: string }[] = [],
) => {
  const response = await apiClient.post("/chat", { message, history });
  return response.data.recommendation;
};
