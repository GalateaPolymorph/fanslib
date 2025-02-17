import { updateScheduledPosts } from "../posts/cron";

let cronInterval: NodeJS.Timeout | null = null;

export const startCronJobs = () => {
  if (cronInterval) {
    return;
  }

  // Run immediately on startup
  updateScheduledPosts();

  // Then run every minute
  cronInterval = setInterval(async () => {
    try {
      await updateScheduledPosts();
    } catch (error) {
      console.error("Error running scheduled post updates:", error);
    }
  }, 60 * 1000); // 60 seconds * 1000 milliseconds
};

export const stopCronJobs = () => {
  if (cronInterval) {
    clearInterval(cronInterval);
    cronInterval = null;
  }
};
