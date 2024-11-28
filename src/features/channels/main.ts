import { ipcMain } from "electron";
import { CHANNEL_TYPES } from "../../lib/database/channels/channelTypes";
import { createChannel } from "../../lib/database/channels/create";
import { deleteChannel } from "../../lib/database/channels/delete";
import { fetchAllChannels, fetchChannelById } from "../../lib/database/channels/fetch";
import { updateChannel } from "../../lib/database/channels/update";

export const registerChannelHandlers = () => {
  ipcMain.handle(
    "channel:create-channel",
    async (
      _event,
      data: { name: string; description?: string; typeId: keyof typeof CHANNEL_TYPES }
    ) => {
      return createChannel(data);
    }
  );

  ipcMain.handle("channel:get-channels", async () => {
    return fetchAllChannels();
  });

  ipcMain.handle("channel:get-channel", async (_event, id: string) => {
    return fetchChannelById(id);
  });

  ipcMain.handle("channel:delete-channel", async (_event, id: string) => {
    return deleteChannel(id);
  });

  ipcMain.handle(
    "channel:update-channel",
    async (
      _event,
      id: string,
      updates: { name?: string; description?: string; typeId?: keyof typeof CHANNEL_TYPES }
    ) => {
      return updateChannel(id, updates);
    }
  );

  ipcMain.handle("channel:get-channel-types", async () => {
    return Object.values(CHANNEL_TYPES);
  });
};
