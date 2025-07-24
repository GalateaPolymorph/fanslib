import { prefixNamespaceObject } from "../../lib/namespace";
import { AutomationHandlers, namespace, PostToRedditPayload } from "./api-type";
import { postToReddit } from "./post-to-reddit";

export const handlers: AutomationHandlers = {
  postToReddit: async (_, payload: PostToRedditPayload) => postToReddit(payload),
};

export const automationHandlers = prefixNamespaceObject(namespace, handlers);
