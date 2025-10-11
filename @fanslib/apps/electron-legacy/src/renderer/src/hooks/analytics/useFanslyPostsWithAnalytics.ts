import { useQuery } from "@tanstack/react-query";
import { FanslyPostWithAnalytics } from "../../../../features/analytics/api-type";

export const useFanslyPostsWithAnalytics = (
  sortBy: string = "date",
  sortDirection: "asc" | "desc" = "desc"
) => {
  return useQuery<FanslyPostWithAnalytics[]>({
    queryKey: ["fanslyPosts", sortBy, sortDirection],
    queryFn: () => window.api["analytics:getFanslyPostsWithAnalytics"](sortBy, sortDirection),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
