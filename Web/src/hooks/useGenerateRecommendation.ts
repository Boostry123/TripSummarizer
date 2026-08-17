import { useMutation } from "@tanstack/react-query";
import { getRecommendation } from "@/Apis/chatService";
import { useRecommendationStore } from "@/store/recommendationStore";

export const useGenerateRecommendation = () => {
  // Pull necessary actions and state from Zustand
  const { history, setRecommendation, addToHistory } = useRecommendationStore();

  return useMutation({
    mutationFn: async (message?: string) => {
      const historyContext =
        history.length > 0 ? [history[0], history[history.length - 1]] : [];

      // Perform the API call
      return await getRecommendation(message, historyContext);
    },
    onSuccess: (data, variables) => {
      // Update Zustand state on success
      setRecommendation(data);

      if (variables) {
        addToHistory({ role: "user", content: variables });
      } else if (history.length === 0) {
        addToHistory({
          role: "user",
          content: "Generate a recommendation for my next trip.",
        });
      }

      addToHistory({ role: "assistant", content: data });
    },
  });
};
