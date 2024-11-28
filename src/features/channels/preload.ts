import { ipcRenderer } from "electron";
import { CHANNEL_TYPES } from "../../lib/database/channels/channelTypes";
import { Channel, ChannelType } from "../../lib/database/channels/type";

export const channelBridge = {
  createChannel: (data: {
    name: string;
    description?: string;
    typeId: keyof typeof CHANNEL_TYPES;
  }) => ipcRenderer.invoke("channel:create-channel", data),

  getAllChannels: () => ipcRenderer.invoke("channel:get-channels") as Promise<Channel[]>,

  getChannel: (id: string) => ipcRenderer.invoke("channel:get-channel", id) as Promise<Channel | null>,

  deleteChannel: (id: string) => ipcRenderer.invoke("channel:delete-channel", id),

  updateChannel: (
    id: string,
    updates: { name?: string; description?: string; typeId?: keyof typeof CHANNEL_TYPES }
  ) => ipcRenderer.invoke("channel:update-channel", id, updates),

  getChannelTypes: () => ipcRenderer.invoke("channel:get-channel-types") as Promise<ChannelType[]>,
};
