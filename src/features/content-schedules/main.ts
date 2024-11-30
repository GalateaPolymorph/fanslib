import { ipcMain } from "electron";
import { createContentSchedule } from "../../lib/database/content-schedules/create";
import { deleteContentSchedule } from "../../lib/database/content-schedules/delete";
import { getContentSchedulesForChannel } from "../../lib/database/content-schedules/get";
import { ContentSchedule } from "../../lib/database/content-schedules/type";
import { updateContentSchedule } from "../../lib/database/content-schedules/update";

export const registerContentScheduleHandlers = () => {
  ipcMain.handle("content-schedule:create", async (_, data: Omit<ContentSchedule, "id">) => {
    return createContentSchedule(data);
  });

  ipcMain.handle("content-schedule:get-for-channel", async (_, channelId: string) => {
    return getContentSchedulesForChannel(channelId);
  });

  ipcMain.handle(
    "content-schedule:update",
    async (_, scheduleId: string, updates: Partial<ContentSchedule>) => {
      const schedule = await updateContentSchedule({
        id: scheduleId,
        ...updates,
      } as ContentSchedule);
      return schedule;
    }
  );

  ipcMain.handle("content-schedule:delete", async (_, scheduleId: string) => {
    await deleteContentSchedule(scheduleId);
  });
};
