import { ipcRenderer } from "electron";
import { ChannelsAPI } from "../types";

export const channelsBridge: ChannelsAPI = {
  getAllChannels: () => ipcRenderer.invoke("channel:get-channels"),
  createChannel: (data) => ipcRenderer.invoke("channel:create-channel", data),
  updateChannel: (id, updates) => ipcRenderer.invoke("channel:update-channel", id, updates),
  deleteChannel: (id) => ipcRenderer.invoke("channel:delete-channel", id),
};
