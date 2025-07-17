import { prefixNamespaceObject } from "../../lib/namespace";
import {
  AutomationHandlers,
  FanslyCredentialExtractionPayload,
  FanslyPostDiscoveryPayload,
  namespace,
  PostToRedditPayload,
} from "./api-type";
import { fanslyAutomation } from "./playwright-fansly-automation";
import { postToReddit } from "./post-to-reddit";

export const handlers: AutomationHandlers = {
  postToReddit: async (_, payload: PostToRedditPayload) => postToReddit(payload),
  extractFanslyCredentials: async (_, payload: FanslyCredentialExtractionPayload) =>
    fanslyAutomation.extractCredentials(payload),
  discoverFanslyPosts: async (_, payload: FanslyPostDiscoveryPayload) => {
    const result = await fanslyAutomation.discoverPosts(payload);

    if (result.posts) {
      console.log("Posts discovered:", result.posts.length);
      console.log("--------------------------------");
      for (const post of result.posts) {
        console.log(
          post.postId,
          "|",
          post.postUrl,
          "|",
          post.statisticsId,
          "|",
          post.statisticsUrl
        );
      }
    }

    return result;
  },
  clearFanslySession: async () => fanslyAutomation.clearSessionData(),
};

export const automationHandlers = prefixNamespaceObject(namespace, handlers);
