import {
  fetchAllContentSchedules,
  updateLastSynced,
} from "../../features/content-schedules/operations";
import { syncPostsForSchedule } from "../../features/posts/sync";

/**
 * Syncs posts for schedules that have been modified since their last sync
 * @returns Number of schedules that were synced
 */
export const syncSchedulesWithPosts = async (): Promise<number> => {
  const schedules = await fetchAllContentSchedules();
  let syncCount = 0;
  for (const schedule of schedules) {
    // Always sync if lastSynced is missing, or if updatedAt is missing (new schedule)
    // Otherwise, only sync if the schedule has been updated since last sync
    const needsSync =
      !schedule.lastSynced ||
      !schedule.updatedAt ||
      new Date(schedule.lastSynced) < new Date(schedule.updatedAt);

    if (!needsSync) continue;
    try {
      await syncPostsForSchedule(schedule);
      syncCount++;

      // Update lastSynced timestamp
      await updateLastSynced(schedule.id, new Date().toISOString());
    } catch (error) {
      console.error(`Failed to sync schedule ${schedule.id}:`, error);
    }
  }

  return syncCount;
};
