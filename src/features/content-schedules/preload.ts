import { ipcRenderer } from "electron";
import { ContentSchedule } from "../../lib/database/content-schedules/type";

export const contentScheduleBridge = {
  createContentSchedule: (data: Omit<ContentSchedule, "id">) =>
    ipcRenderer.invoke("content-schedule:create", data),

  getContentSchedulesForChannel: (channelId: string) =>
    ipcRenderer.invoke("content-schedule:get-for-channel", channelId) as Promise<ContentSchedule[]>,

  updateContentSchedule: (scheduleId: string, updates: Partial<ContentSchedule>) =>
    ipcRenderer.invoke("content-schedule:update", scheduleId, updates),

  deleteContentSchedule: (scheduleId: string) =>
    ipcRenderer.invoke("content-schedule:delete", scheduleId),
};
