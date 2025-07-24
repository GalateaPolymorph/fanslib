import { prefixNamespaceObject } from "../../lib/namespace";
import { HashtagHandlers, namespace } from "./api-type";
import { deleteHashtag, findOrCreateHashtag, getAllHashtags } from "./operations";
import { getHashtagStats, incrementHashtagViews } from "./stats-operations";

export const handlers: HashtagHandlers = {
  "stats:set": async (_, hashtagId, channelId, viewCount) => {
    return incrementHashtagViews(hashtagId, channelId, viewCount);
  },

  "stats:get": async (_, hashtagId) => {
    return getHashtagStats(hashtagId);
  },

  list: async () => {
    return getAllHashtags();
  },

  create: async (_, name) => {
    const hashtag = await findOrCreateHashtag(name);
    return {
      ...hashtag,
      channelStats: [],
    };
  },

  delete: async (_, hashtagId) => {
    return deleteHashtag(hashtagId);
  },
};

export const hashtagHandlers = prefixNamespaceObject(namespace, handlers);
