import { prefixNamespaceObject } from "../../lib/namespace";
import { namespace, RedditPosterHandlers } from "./api-type";
import {
  generateRandomPost,
  generatePosts,
  regenerateMedia,
  scheduleAllPosts,
  getScheduledPosts,
  performRedditLogin,
  checkRedditLoginStatus,
} from "./operations";

export const handlers: RedditPosterHandlers = {
  generateRandomPost: (_, subreddits, channelId) => generateRandomPost(subreddits, channelId),
  generatePosts: (_, count, subreddits, channelId) => generatePosts(count, subreddits, channelId),
  regenerateMedia: (_, subredditId, channelId) => regenerateMedia(subredditId, channelId),
  scheduleAllPosts: (_, posts, channelId) => scheduleAllPosts(posts, channelId),
  getScheduledPosts: (_, channelId) => getScheduledPosts(channelId),
  loginToReddit: (_, userId) => performRedditLogin(userId),
  checkLoginStatus: (_, userId) => checkRedditLoginStatus(userId),
};

export const redditPosterHandlers = prefixNamespaceObject(namespace, handlers);
