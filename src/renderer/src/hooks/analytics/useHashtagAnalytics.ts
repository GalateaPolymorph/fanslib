import { useQuery } from "@tanstack/react-query";
import { HashtagAnalytics } from "../../../../features/analytics/api-type";

export const useHashtagAnalytics = () => {
  return useQuery<HashtagAnalytics>({
    queryKey: ["hashtagAnalytics"],
    queryFn: () => window.api["analytics:getHashtagAnalytics"](),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
