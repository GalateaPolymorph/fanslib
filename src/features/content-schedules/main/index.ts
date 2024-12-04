import { ipcMain } from "electron";
import { createContentSchedule } from "../../../lib/database/content-schedules/create";
import { deleteContentSchedule } from "../../../lib/database/content-schedules/delete";
import {
  getAllContentSchedules,
  getContentSchedulesForChannel,
} from "../../../lib/database/content-schedules/get";
import { ContentSchedule } from "../../../lib/database/content-schedules/type";
import { updateContentSchedule } from "../../../lib/database/content-schedules/update";
import { syncSchedulePosts } from "../../../lib/database/posts/sync";
import { syncSchedulesWithPosts } from "../../../lib/database/sync-manager";

export const registerContentScheduleHandlers = () => {
  ipcMain.handle("content-schedule:get-all", async () => {
    return getAllContentSchedules();
  });

  ipcMain.handle(
    "content-schedule:create",
    async (_, data: Omit<ContentSchedule, "id" | "createdAt" | "updatedAt">) => {
      const schedule = await createContentSchedule(data);
      await syncSchedulePosts(schedule);
      return schedule;
    }
  );

  ipcMain.handle("content-schedule:get-by-channel", async (_, channelId: string) => {
    return getContentSchedulesForChannel(channelId);
  });

  ipcMain.handle(
    "content-schedule:update",
    async (
      _,
      id: string,
      updates: Partial<Omit<ContentSchedule, "id" | "createdAt" | "updatedAt">>
    ) => {
      const schedule = await updateContentSchedule(id, updates);
      await syncSchedulePosts(schedule);
      return schedule;
    }
  );

  ipcMain.handle("content-schedule:delete", async (_, id: string) => {
    await deleteContentSchedule(id);
  });

  ipcMain.handle("content-schedule:sync-all", async () => {
    await syncSchedulesWithPosts();
  });
};
