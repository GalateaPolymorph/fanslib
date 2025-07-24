import { SessionStorage } from "@fanslib/reddit-automation";
import { app } from "electron";
import { existsSync, mkdirSync } from "fs";
import { readFile, unlink, writeFile } from "fs/promises";
import { join } from "path";

const ensureDirectoryExists = (dirPath: string): void => {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
};

export const createElectronSessionStorage = (): SessionStorage => {
  const userDataDir = join(app.getPath("userData"), "reddit-browser-data");
  const sessionPath = join(userDataDir, "reddit-session.json");

  ensureDirectoryExists(userDataDir);

  return {
    getPath: () => sessionPath,

    exists: async () => existsSync(sessionPath),

    read: async () => readFile(sessionPath, "utf8"),

    write: async (data: string) => {
      await writeFile(sessionPath, data, "utf8");
      console.log(`[Reddit Automation] Session saved to: ${sessionPath}`);
    },

    clear: async () => {
      if (!existsSync(sessionPath)) {
        return;
      }

      try {
        await unlink(sessionPath);
        console.log(`[Reddit Automation] Session cleared from: ${sessionPath}`);
      } catch (error) {
        console.error(`[Reddit Automation] Failed to clear session:`, error);
      }
    },
  };
};
