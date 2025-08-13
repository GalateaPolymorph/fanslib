import { Subreddit } from "../../channels/subreddit";
import { Post } from "../../posts/entity";

export const selectSubreddit = (subreddits: Subreddit[]): Subreddit | null => {
  if (subreddits.length === 0) return null;

  // Simple random selection - constraints are handled by intelligent scheduling
  const randomIndex = Math.floor(Math.random() * subreddits.length);
  return subreddits[randomIndex];
};

export const getSubredditPosts = (channelPosts: Post[], subredditId: string): Post[] => 
  channelPosts.filter((post) => post.subredditId === subredditId);