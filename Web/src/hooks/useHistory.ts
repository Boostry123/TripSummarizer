import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getHistory, deleteHistory } from "@/Apis/historyService";
import { History } from "@/Types/history";

export const useHistory = () => {
  const queryClient = useQueryClient();

  // Query: Get all history
  const historyQuery = useQuery<History[]>({
    queryKey: ["history"],
    queryFn: getHistory,
  });

  // Mutation: Delete a history entry
  const deleteHistoryMutation = useMutation({
    mutationFn: (id: string) => deleteHistory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });

  return {
    historyData: historyQuery.data,
    isLoading: historyQuery.isLoading,
    error: historyQuery.error,
    deleteHistory: deleteHistoryMutation.mutateAsync,
    isDeleting: deleteHistoryMutation.isPending,
  };
};
