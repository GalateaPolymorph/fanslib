import { prefixNamespaceObject } from "../../lib/namespace";
import { namespace, RedditPosterHandlers } from "./api-type";
import {
  checkRedditLoginStatus,
  generatePosts,
  generateRandomPost,
  getScheduledPosts,
  performRedditLogin,
  regenerateMedia,
  scheduleAllPosts,
} from "./operations";

export const handlers: RedditPosterHandlers = {
  generateRandomPost: (_, subreddits, channelId) => generateRandomPost(subreddits, channelId),
  generatePosts: (_, count, subreddits, channelId) => generatePosts(count, subreddits, channelId),
  regenerateMedia: (_, subredditId, channelId) => regenerateMedia(subredditId, channelId),
  scheduleAllPosts: (_, posts) => scheduleAllPosts(posts),
  getScheduledPosts: (_) => getScheduledPosts(),
  loginToReddit: (_, userId) => performRedditLogin(userId),
  checkLoginStatus: (_, userId) => checkRedditLoginStatus(userId),
};

export const redditPosterHandlers = prefixNamespaceObject(namespace, handlers);
