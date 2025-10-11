import { SessionStorage } from "@fanslib/reddit-automation";
import { app } from "electron";
import { existsSync, mkdirSync } from "fs";
import { unlink, writeFile } from "fs/promises";
import { join } from "path";
import { getSession, getSessionData } from "../server-communication/api-client";

const ensureDirectoryExists = (dirPath: string): void => {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
};

export const createServerBackedSessionStorage = (username?: string): SessionStorage => {
  const userDataDir = join(app.getPath("userData"), "reddit-browser-data");
  const tempSessionPath = join(userDataDir, `temp-session-${username || "default"}.json`);

  ensureDirectoryExists(userDataDir);

  return {
    getPath: () => tempSessionPath,

    exists: async (): Promise<boolean> => {
      try {
        const serverSession = await getSession(username);
        return serverSession !== null;
      } catch {
        return false;
      }
    },

    read: async (): Promise<string> => {
      try {
        // Always fetch fresh session data from server
        const sessionData = await getSessionData(username);
        if (!sessionData) {
          throw new Error("No session data found on server");
        }
        
        // Create temporary file from server data for reddit-automation library
        const sessionJson = JSON.stringify(sessionData, null, 2);
        await writeFile(tempSessionPath, sessionJson, "utf8");
        
        return sessionJson;
      } catch (error) {
        throw new Error(`Failed to read session from server: ${error}`);
      }
    },

    write: async (data: string): Promise<void> => {
      // Write to temporary file but don't sync to server
      // Session management is handled through login/API calls
      await writeFile(tempSessionPath, data, "utf8");
      console.log(`[Reddit Automation] Temporary session written to: ${tempSessionPath}`);
    },

    clear: async (): Promise<void> => {
      try {
        if (existsSync(tempSessionPath)) {
          await unlink(tempSessionPath);
          console.log(`[Reddit Automation] Temporary session cleared: ${tempSessionPath}`);
        }
      } catch (error) {
        console.warn(`[Reddit Automation] Failed to clear temp session:`, error);
      }
    },
  };
};

// Keep legacy function for backward compatibility, but redirect to server-backed
export const createElectronSessionStorage = (): SessionStorage => {
  console.warn("⚠️ createElectronSessionStorage is deprecated, use createServerBackedSessionStorage");
  return createServerBackedSessionStorage();
};
