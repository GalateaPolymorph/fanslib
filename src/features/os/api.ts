import { clipboard, shell } from "electron";
import fs from "fs";
import path from "path";
import { prefixNamespaceObject } from "../../lib/namespace";
import { namespace, OsHandlers } from "./api-type";

export const handlers: OsHandlers = {
  revealInFinder: (_, filePath) => {
    try {
      // Ensure the file exists before trying to reveal it
      if (fs.existsSync(filePath)) {
        shell.showItemInFolder(path.normalize(filePath));
        return { success: true };
      } else {
        throw new Error("File does not exist");
      }
    } catch (error) {
      console.error("Failed to reveal file:", error);
      throw error;
    }
  },
  copyToClipboard: (_, text) => {
    try {
      clipboard.writeText(text);
      return { success: true };
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      throw error;
    }
  },
};

export const osHandlers = prefixNamespaceObject(namespace, handlers);
