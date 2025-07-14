import { prefixNamespaceObject } from "../../lib/namespace";
import {
  AutomationHandlers,
  namespace,
  PostToRedditPayload,
  FanslyFullAutomationPayload,
  FanslyCredentialExtractionPayload,
  FanslyPostDiscoveryPayload,
} from "./api-type";
import { postToReddit } from "./post-to-reddit";
import { fanslyAutomation } from "./playwright-fansly-automation";

export const handlers: AutomationHandlers = {
  postToReddit: async (_, payload: PostToRedditPayload) => postToReddit(payload),
  runFanslyFullAutomation: async (_, payload: FanslyFullAutomationPayload) =>
    fanslyAutomation.runFullAutomation(payload),
  extractFanslyCredentials: async (_, payload: FanslyCredentialExtractionPayload) =>
    fanslyAutomation.extractCredentialsOnly(payload),
  discoverFanslyPosts: async (_, payload: FanslyPostDiscoveryPayload) =>
    fanslyAutomation.discoverPostsOnly(payload),
  clearFanslySession: async () => fanslyAutomation.clearSessionData(),
};

export const automationHandlers = prefixNamespaceObject(namespace, handlers);
