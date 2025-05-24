import { useQuery } from "@tanstack/react-query";
import { TimeAnalytics } from "../../../../features/analytics/api-type";

export const useTimeAnalytics = () => {
  return useQuery<TimeAnalytics>({
    queryKey: ["timeAnalytics"],
    queryFn: () => window.api["analytics:getTimeAnalytics"](),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
