import { prefixNamespaceObject } from "../../lib/namespace";
import { ChannelHandlers, namespace } from "./api-type";
import { CHANNEL_TYPES } from "./channelTypes";
import {
  createChannel,
  deleteChannel,
  fetchAllChannels,
  fetchChannelById,
  updateChannel,
  updateDefaultHashtags,
} from "./operations";

const handlers: ChannelHandlers = {
  create: (_, data) => createChannel(data),
  getAll: () => fetchAllChannels(),
  getById: (_, id) => fetchChannelById(id),
  delete: (_, id) => deleteChannel(id),
  update: (_, id, updates) => updateChannel(id, updates),
  getTypes: () => Object.values(CHANNEL_TYPES),
  updateDefaultHashtags: (_, channelId, hashtags) => updateDefaultHashtags(channelId, hashtags),
};

export const channelHandlers = prefixNamespaceObject(namespace, handlers);
