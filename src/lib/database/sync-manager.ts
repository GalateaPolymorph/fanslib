import { contentSchedulesDb } from "./content-schedules/base";
import { getAllContentSchedules } from "./content-schedules/get";
import { syncSchedulePosts } from "./posts/sync";

/**
 * Syncs posts for schedules that have been modified since their last sync
 * @returns Number of schedules that were synced
 */
export const syncSchedulesWithPosts = async (): Promise<number> => {
  const db = await contentSchedulesDb();
  const schedules = await getAllContentSchedules();
  let syncCount = 0;

  for (const schedule of schedules) {
    // Always sync if lastSynced is missing, or if updatedAt is missing (new schedule)
    // Otherwise, only sync if the schedule has been updated since last sync
    const needsSync =
      !schedule.lastSynced ||
      !schedule.updatedAt ||
      new Date(schedule.lastSynced) < new Date(schedule.updatedAt);

    if (needsSync) {
      try {
        await syncSchedulePosts(schedule);
        syncCount++;

        // Update lastSynced timestamp
        await new Promise<void>((resolve, reject) => {
          db.update(
            { id: schedule.id },
            {
              $set: {
                lastSynced: new Date().toISOString(),
                // Ensure updatedAt exists
                updatedAt: schedule.updatedAt || new Date().toISOString(),
              },
            },
            {},
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        });
      } catch (error) {
        console.error(`Failed to sync schedule ${schedule.id}:`, error);
      }
    }
  }

  return syncCount;
};
