import { sendNotification } from "../../notifications/api";
import { RedditPostProgress } from "./context";

export const emitProgress = (progress: RedditPostProgress): void => {
  console.log(`[Reddit Automation] ${progress.stage}: ${progress.message}`);

  // Send user notification for important stages
  if (progress.stage === "completed" || progress.stage === "failed") {
    sendNotification({
      title: "Reddit Post",
      body: progress.message,
    });
  }
};
