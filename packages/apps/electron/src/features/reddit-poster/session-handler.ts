import { readFile, writeFile, mkdir, unlink } from "fs/promises";
import { join, dirname } from "path";
import { app } from "electron";
import type { SessionStorage } from "@fanslib/reddit-automation";

export const getElectronSessionPath = (): string => {
  const userDataDir = join(app.getPath("userData"), "reddit-browser-data");
  return join(userDataDir, "reddit-session.json");
};

export const createSessionStorage = (): SessionStorage => {
  const sessionPath = getElectronSessionPath();

  return {
    async exists(): Promise<boolean> {
      try {
        await readFile(sessionPath, "utf-8");
        return true;
      } catch {
        return false;
      }
    },
    getPath(): string {
      return sessionPath;
    },
    async read(): Promise<string> {
      return await readFile(sessionPath, "utf-8");
    },
    async write(data: string): Promise<void> {
      await mkdir(dirname(sessionPath), { recursive: true });
      await writeFile(sessionPath, data, "utf-8");
    },
    async clear(): Promise<void> {
      try {
        await unlink(sessionPath);
      } catch {
        // File doesn't exist, which is fine
      }
    },
  };
};

export const hasElectronSession = async (): Promise<boolean> => {
  const sessionStorage = createSessionStorage();
  return await sessionStorage.exists();
};

export const clearElectronSession = async (): Promise<void> => {
  const sessionStorage = createSessionStorage();
  await sessionStorage.clear();
};

export const readElectronSession = async (): Promise<string | null> => {
  const sessionStorage = createSessionStorage();

  if (!(await sessionStorage.exists())) {
    return null;
  }

  try {
    return await sessionStorage.read();
  } catch {
    return null;
  }
};
