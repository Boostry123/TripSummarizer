import { useQuery } from "@tanstack/react-query";
import { getHistory } from "@/Apis/historyService";

import { History } from "@/Types/history";

export const useHistory = () => {
  // Query: Get all history
  const { data: historyData, isLoading } = useQuery<History[]>({
    queryKey: ["history"],
    queryFn: getHistory,
  });

  return {
    historyData,
    isLoading,
  };
};
