import { useQuery } from "@tanstack/react-query";

// Query keys
export const subredditLastPostDateKeys = {
  lastPostDates: (ids: string[]) => ["subreddit-last-post-dates", ids.sort()] as const,
};

// Fetch subreddit last post dates
export const useSubredditLastPostDates = (subredditIds: string[]) => {
  return useQuery({
    queryKey: subredditLastPostDateKeys.lastPostDates(subredditIds),
    queryFn: async () => {
      if (subredditIds.length === 0) return {};
      const dates = await window.api["channel:subreddit-last-post-dates"](subredditIds);
      return dates;
    },
    enabled: subredditIds.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
