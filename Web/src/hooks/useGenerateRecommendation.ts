import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getRecommendation } from "@/Apis/chatService";
import { useRecommendationStore } from "@/store/recommendationStore";

export const useGenerateRecommendation = () => {
  // Pull necessary actions and state from Zustand
  const { setRecommendation, addToHistory, setRecommendationId } =
    useRecommendationStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (message?: string) => {
      const history = useRecommendationStore.getState().history;
      const recId = useRecommendationStore.getState().id;
      const historyContext =
        history?.length > 0 ? [history[0], history[history.length - 1]] : [];

      // Perform the API call
      return await getRecommendation(message, historyContext, recId);
    },
    onSuccess: (data, variables) => {
      const recommendation =
        data.chat_history[data.chat_history.length - 1].content;
      // Update Zustand state on success
      setRecommendation(recommendation);
      setRecommendationId(data.id);
      // Invalidate the cached history
      queryClient.invalidateQueries({ queryKey: ["history"] });

      addToHistory({
        role: "user",
        content: variables || "Generate a recommendation for my next trip.",
      });

      addToHistory({ role: "assistant", content: recommendation });
    },
  });
};
