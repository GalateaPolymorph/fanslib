import { sendNotification } from "../../notifications/api";
import type { FanslyAutomationProgress } from "./context";

export const emitProgress = (progress: FanslyAutomationProgress): void => {
  console.log(
    `[Fansly Automation] ${progress.stage}: ${progress.message}${
      progress.progress ? ` (${progress.progress}%)` : ""
    }`
  );

  // Send user notification for important stages
  if (progress.stage === "completed" || progress.stage === "failed") {
    sendNotification({
      title: "Fansly Automation",
      body: progress.message,
    });
  }

  // TODO: Emit IPC event for UI progress updates
  // This would follow the same pattern as Reddit automation
  // ipcMain.emit('fansly:automation:progress', progress);
};

export const createProgressReporter = (totalSteps: number) => {
  let currentStep = 0;

  return (stage: FanslyAutomationProgress["stage"], message: string) => {
    currentStep++;
    const progress = Math.round((currentStep / totalSteps) * 100);

    emitProgress({
      stage,
      message,
      progress,
    });
  };
};
