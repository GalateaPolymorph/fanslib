import { db } from "../../lib/db";
import { prefixNamespaceObject } from "../../lib/namespace";
import { ChannelHandlers, namespace } from "./api-type";
import { CHANNEL_TYPES } from "./channelTypes";
import { Channel } from "./entity";
import {
  createChannel,
  createSubreddit,
  deleteChannel,
  deleteSubreddit,
  fetchChannelById,
  listSubreddits,
  updateChannel,
  updateDefaultHashtags,
  updateSubreddit,
} from "./operations";

export const handlers: ChannelHandlers = {
  create: (_, data) => createChannel(data),
  getAll: async () => {
    const dataSource = await db();
    const repository = dataSource.getRepository(Channel);
    return repository.find({
      relations: { type: true, defaultHashtags: true },
    });
  },
  getById: (_, id) => fetchChannelById(id),
  delete: (_, id) => deleteChannel(id),
  update: (_, id, updates) => updateChannel(id, updates),
  getTypes: () => Object.values(CHANNEL_TYPES),
  updateDefaultHashtags: (_, channelId, hashtags) => updateDefaultHashtags(channelId, hashtags),
  "subreddit-create": (_, data) => createSubreddit(data),
  "subreddit-list": () => listSubreddits(),
  "subreddit-update": (_, id, updates) => updateSubreddit(id, updates),
  "subreddit-delete": (_, id) => deleteSubreddit(id),
};

export const channelHandlers = prefixNamespaceObject(namespace, handlers);
