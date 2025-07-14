import { promises as fs } from "fs";
import path from "path";
import type { FanslyAutomationContext } from "./context";
import { getSessionFilePath, getUserDataDir } from "./browser";

export const saveSession = async (context: FanslyAutomationContext): Promise<void> => {
  if (!context.browserContext) {
    return;
  }

  try {
    const sessionPath = getSessionFilePath();
    const sessionDir = path.dirname(sessionPath);

    // Ensure the session directory exists
    await fs.mkdir(sessionDir, { recursive: true });

    // Save browser context state
    await context.browserContext.storageState({ path: sessionPath });
    console.log(`[Fansly Automation] Session saved to: ${sessionPath}`);
  } catch (error) {
    console.error("[Fansly Automation] Failed to save session:", error);
  }
};

export const clearSession = async (): Promise<void> => {
  try {
    const sessionPath = getSessionFilePath();
    const userDataDir = getUserDataDir();

    // Remove session file
    try {
      await fs.unlink(sessionPath);
      console.log("[Fansly Automation] Session file removed");
    } catch (error) {
      // File might not exist, which is fine
    }

    // Optionally clear user data directory
    try {
      await fs.rmdir(userDataDir, { recursive: true });
      console.log("[Fansly Automation] User data directory cleared");
    } catch (error) {
      console.warn("[Fansly Automation] Could not clear user data directory:", error);
    }
  } catch (error) {
    console.error("[Fansly Automation] Error clearing session:", error);
  }
};

export const sessionExists = async (): Promise<boolean> => {
  try {
    const sessionPath = getSessionFilePath();
    await fs.access(sessionPath);
    return true;
  } catch {
    return false;
  }
};

export const getSessionAge = async (): Promise<number | null> => {
  try {
    const sessionPath = getSessionFilePath();
    const stats = await fs.stat(sessionPath);
    return Date.now() - stats.mtime.getTime();
  } catch {
    return null;
  }
};

// Check if session is likely expired (older than 24 hours)
export const isSessionExpired = async (): Promise<boolean> => {
  const age = await getSessionAge();
  if (!age) return true;

  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  return age > TWENTY_FOUR_HOURS;
};
