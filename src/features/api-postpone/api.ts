import { prefixNamespaceObject } from "../../lib/namespace";
import { APIPostponeHandlers, namespace } from "./api-type";
import { draftBlueskyPost, findRedgifsURL, refreshRedgifsURL, findSubredditPostingTimes } from "./operations";

const handlers: APIPostponeHandlers = {
  draftBlueskyPost: (_, data) => draftBlueskyPost(data),
  findRedgifsURL: (_, data) => findRedgifsURL(data),
  refreshRedgifsURL: (_, data) => refreshRedgifsURL(data),
  findSubredditPostingTimes: (_, data) => findSubredditPostingTimes(data),
};

export const apiPostponeHandlers = prefixNamespaceObject(namespace, handlers);
