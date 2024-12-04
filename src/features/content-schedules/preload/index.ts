import { ipcRenderer } from "electron";
import { ContentSchedulesAPI } from "../types";

export const contentSchedulesBridge: ContentSchedulesAPI = {
  getAllSchedules: () => ipcRenderer.invoke("content-schedule:get-all"),
  getSchedulesByChannel: (channelId) =>
    ipcRenderer.invoke("content-schedule:get-by-channel", channelId),
  createSchedule: (data) => ipcRenderer.invoke("content-schedule:create", data),
  updateSchedule: (id, updates) => ipcRenderer.invoke("content-schedule:update", id, updates),
  deleteSchedule: (id) => ipcRenderer.invoke("content-schedule:delete", id),
  syncAllSchedules: () => ipcRenderer.invoke("content-schedule:sync-all"),
};
