import { useQuery } from "@tanstack/react-query";
import { ActionableInsight } from "../../../../features/analytics/api-type";

export const useInsights = () => {
  return useQuery<ActionableInsight[]>({
    queryKey: ["insights"],
    queryFn: async () => {
      return window.api["analytics:generateInsights"]();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
