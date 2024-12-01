import { ipcMain } from "electron";
import { createContentSchedule } from "../../lib/database/content-schedules/create";
import { deleteContentSchedule } from "../../lib/database/content-schedules/delete";
import {
  getAllContentSchedules,
  getContentSchedulesForChannel,
} from "../../lib/database/content-schedules/get";
import { ContentSchedule } from "../../lib/database/content-schedules/type";
import { updateContentSchedule } from "../../lib/database/content-schedules/update";
import { syncSchedulePosts } from "../../lib/database/posts/sync";

export const registerContentScheduleHandlers = () => {
  ipcMain.handle("content-schedule:create", async (_, data: Omit<ContentSchedule, "id">) => {
    const schedule = await createContentSchedule(data);
    await syncSchedulePosts(schedule);
    return schedule;
  });

  ipcMain.handle("content-schedule:get-by-channel", async (_, channelId: string) => {
    return getContentSchedulesForChannel(channelId);
  });

  ipcMain.handle(
    "content-schedule:update",
    async (_, scheduleId: string, updates: Partial<ContentSchedule>) => {
      console.log("Updating schedule", scheduleId, updates);
      const schedule = await updateContentSchedule(scheduleId, updates);
      await syncSchedulePosts(schedule);
      return schedule;
    }
  );

  ipcMain.handle("content-schedule:delete", async (_, scheduleId: string) => {
    await deleteContentSchedule(scheduleId);
  });

  ipcMain.handle("content-schedule:sync-all", async () => {
    const schedules = await getAllContentSchedules();
    await Promise.all(schedules.map((schedule) => syncSchedulePosts(schedule)));
  });
};
