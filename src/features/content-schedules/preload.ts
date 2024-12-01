import { ipcRenderer } from "electron";
import { ContentSchedule } from "../../lib/database/content-schedules/type";

export const contentScheduleBridge = {
  createContentSchedule: (data: Omit<ContentSchedule, "id" | "createdAt" | "updatedAt">) =>
    ipcRenderer.invoke("content-schedule:create", data),

  getContentSchedulesForChannel: (channelId: string) =>
    ipcRenderer.invoke("content-schedule:get-by-channel", channelId),

  updateContentSchedule: (scheduleId: string, updates: Partial<ContentSchedule>) =>
    ipcRenderer.invoke("content-schedule:update", scheduleId, updates),

  deleteContentSchedule: (scheduleId: string) =>
    ipcRenderer.invoke("content-schedule:delete", scheduleId),

  syncAllSchedules: () => ipcRenderer.invoke("content-schedule:sync-all"),
};
