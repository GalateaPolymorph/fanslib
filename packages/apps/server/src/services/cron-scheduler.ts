import cron from "node-cron";
import { processAllDueJobs } from "./reddit-poster";

let tasks: cron.ScheduledTask[] = [];

export const start = (): void => {
  console.log("⏰ Starting Reddit queue cron scheduler...");

  const queueTask = cron.schedule("* * * * *", async () => {
    try {
      await processAllDueJobs();
    } catch (error) {
      console.error("❌ Error in queue cron job:", error);
    }
  });

  tasks.push(queueTask);
  queueTask.start();

  console.log("✅ Reddit queue cron scheduler started - checking every minute");
};

export const stop = (): void => {
  console.log("⏹️ Stopping Reddit queue cron scheduler...");

  tasks.forEach((task) => {
    if (task) {
      task.stop();
    }
  });

  tasks = [];
  console.log("✅ Reddit queue cron scheduler stopped");
};

export const restart = (): void => {
  stop();
  start();
};

export const isRunning = (): boolean => {
  return tasks.length > 0;
};
