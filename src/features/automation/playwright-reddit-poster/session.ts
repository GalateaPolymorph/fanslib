import { app } from "electron";
import { existsSync, mkdirSync } from "fs";
import { unlink } from "fs/promises";
import { join } from "path";
import { RedditPostingContext } from "./context";

export const getUserDataDir = (): string => {
  const userDataDir = join(app.getPath("userData"), "reddit-browser-data");

  // Ensure the directory exists
  if (!existsSync(userDataDir)) {
    mkdirSync(userDataDir, { recursive: true });
  }

  return userDataDir;
};

export const getSessionFilePath = (): string => {
  return join(getUserDataDir(), "reddit-session.json");
};

export const saveSession = async (context: RedditPostingContext): Promise<void> => {
  if (!context.browserContext) {
    return;
  }

  try {
    const sessionPath = getSessionFilePath();
    await context.browserContext.storageState({ path: sessionPath });
    console.log(`[Reddit Automation] Session saved to: ${sessionPath}`);
  } catch (error) {
    console.error(`[Reddit Automation] Failed to save session:`, error);
  }
};

export const clearSession = async (): Promise<void> => {
  try {
    const sessionPath = getSessionFilePath();
    if (!existsSync(sessionPath)) {
      return;
    }

    await unlink(sessionPath);
    console.log(`[Reddit Automation] Session cleared from: ${sessionPath}`);
  } catch (error) {
    console.error(`[Reddit Automation] Failed to clear session:`, error);
  }
};
