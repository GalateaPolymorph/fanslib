import { prefixNamespaceObject } from "../../lib/namespace";
import { syncSchedulesWithPosts } from "../posts/sync-manager";
import { ContentScheduleHandlers, namespace } from "./api-type";
import {
  createContentSchedule,
  deleteContentSchedule,
  fetchAllContentSchedules,
  fetchContentSchedulesByChannel,
  updateContentSchedule,
} from "./operations";

export const handlers: ContentScheduleHandlers = {
  getAll: () => fetchAllContentSchedules(),
  getByChannel: (_, channelId) => fetchContentSchedulesByChannel(channelId),
  create: async (_, data) => {
    const schedule = await createContentSchedule(data);
    return schedule;
  },
  update: async (_, id, updates) => {
    const schedule = await updateContentSchedule(id, updates);
    return schedule;
  },
  delete: (_, id) => deleteContentSchedule(id),
  syncAll: () => syncSchedulesWithPosts(),
};

export const contentScheduleHandlers = prefixNamespaceObject(namespace, handlers);
