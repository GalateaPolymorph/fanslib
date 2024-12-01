import { ContentSchedule } from "../../lib/database/content-schedules/type";

export interface ContentSchedulesAPI {
  /**
   * Get all content schedules
   */
  getAllSchedules: () => Promise<ContentSchedule[]>;

  /**
   * Get schedules for a specific channel
   * @param channelId Channel ID
   */
  getSchedulesByChannel: (channelId: string) => Promise<ContentSchedule[]>;

  /**
   * Create a new content schedule
   * @param data Schedule data
   */
  createSchedule: (
    data: Omit<ContentSchedule, "id" | "createdAt" | "updatedAt">
  ) => Promise<ContentSchedule>;

  /**
   * Update a content schedule
   * @param id Schedule ID
   * @param updates Updates to apply
   */
  updateSchedule: (
    id: string,
    updates: Partial<Omit<ContentSchedule, "id" | "createdAt" | "updatedAt">>
  ) => Promise<ContentSchedule>;

  /**
   * Delete a content schedule
   * @param id Schedule ID
   */
  deleteSchedule: (id: string) => Promise<void>;
}
