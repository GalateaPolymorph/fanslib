import { useCallback } from "react";
import { Subreddit } from "../../../../features/channels/subreddit";
import { useSubredditLastPostDates } from "../api/useChannels";

type SubredditSelectorResult = {
  selectOptimalSubreddit: () => Promise<Subreddit | null>;
  eligibleSubreddits: Subreddit[];
  isLoading: boolean;
  error: Error | null;
};

export const useSubredditSelector = (subreddits: Subreddit[]): SubredditSelectorResult => {
  const subredditIds = subreddits.map((s) => s.id);
  const {
    data: lastPostDates = {},
    isLoading,
    error,
    refetch,
  } = useSubredditLastPostDates(subredditIds);

  const selectOptimalSubreddit = useCallback(async (): Promise<Subreddit | null> => {
    if (isLoading) {
      throw new Error("Subreddit data is still loading");
    }

    if (error) {
      throw error;
    }

    await refetch();

    // Filter eligible subreddits based on post frequency rules
    const eligibleSubreddits = subreddits.filter((subreddit) => {
      const lastPostDate = lastPostDates[subreddit.id];

      // If no last post date, subreddit is eligible
      if (!lastPostDate) {
        return true;
      }

      // If no maxPostFrequencyHours set, subreddit is eligible
      if (!subreddit.maxPostFrequencyHours) {
        return true;
      }

      // Check if enough time has passed since last post
      const lastPost = new Date(lastPostDate);
      const nextPostTime = new Date(
        lastPost.getTime() + subreddit.maxPostFrequencyHours * 60 * 60 * 1000
      );
      const now = new Date();

      return now >= nextPostTime;
    });

    // Select random subreddit from eligible ones
    // Each call will get a new random selection due to Math.random()
    const selectedSubreddit =
      eligibleSubreddits.length > 0
        ? eligibleSubreddits[Math.floor(Math.random() * eligibleSubreddits.length)]
        : null;

    return selectedSubreddit;
  }, [subreddits, lastPostDates, isLoading, error, refetch]);

  // Calculate eligible subreddits for display purposes
  const eligibleSubreddits = subreddits.filter((subreddit) => {
    const lastPostDate = lastPostDates[subreddit.id];

    if (!lastPostDate) {
      return true;
    }

    if (!subreddit.maxPostFrequencyHours) {
      return true;
    }

    const lastPost = new Date(lastPostDate);
    const nextPostTime = new Date(
      lastPost.getTime() + subreddit.maxPostFrequencyHours * 60 * 60 * 1000
    );
    const now = new Date();

    return now >= nextPostTime;
  });

  return {
    selectOptimalSubreddit,
    eligibleSubreddits,
    isLoading,
    error: error as Error | null,
  };
};
