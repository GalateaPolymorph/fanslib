import { clipboard, dialog, nativeImage, shell } from "electron";
import fs from "fs";
import path from "path";
import { prefixNamespaceObject } from "../../lib/namespace";
import { namespace, OsHandlers, ShowOpenDialogOptions } from "./api-type";

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
  startDrag: (event, filePaths) => {
    try {
      const validFiles = filePaths.filter((filePath) => fs.existsSync(filePath));

      if (validFiles.length === 0) {
        throw new Error("No valid files to drag");
      }

      // Get the sender (webContents)
      const webContents = event.sender;
      if (!webContents) {
        throw new Error("No webContents found");
      }

      // For multiple files, try the files array first, fallback to single file
      // Note: Multiple file drag has limitations on Windows in Electron
      let dragItem;

      if (validFiles.length === 1) {
        // Single file - most reliable approach
        dragItem = {
          file: validFiles[0],
          icon: createDragIcon(validFiles[0]),
        };
      } else {
        // Multiple files - may not work perfectly on Windows
        try {
          dragItem = {
            files: validFiles,
            icon: createGenericIcon(),
          };
        } catch (multiFileError) {
          console.warn("Multiple file drag failed, falling back to first file:", multiFileError);
          // Fallback to single file if multiple fails
          dragItem = {
            file: validFiles[0],
            icon: createDragIcon(validFiles[0]),
          };
        }
      }

      // Start the drag operation
      webContents.startDrag(dragItem);

      return { success: true, fileCount: validFiles.length };
    } catch (error) {
      console.error("Failed to start drag:", error);
      throw error;
    }
  },
  showOpenDialog: async (_, options: ShowOpenDialogOptions) => {
    try {
      const result = await dialog.showOpenDialog(options);
      return {
        canceled: result.canceled,
        filePaths: result.filePaths || [],
      };
    } catch (error) {
      console.error("Failed to show open dialog:", error);
      throw error;
    }
  },
};

const createDragIcon = (filePath: string) => {
  try {
    const ext = path.extname(filePath).toLowerCase();

    // For image files, try to create an icon from the image itself
    if ([".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"].includes(ext)) {
      const icon = nativeImage.createFromPath(filePath);
      if (!icon.isEmpty()) {
        // Resize to a reasonable drag icon size
        return icon.resize({ width: 64, height: 64 });
      }
    }

    // For other files or if image icon creation fails, use a generic icon
    return createGenericIcon();
  } catch (error) {
    console.warn("Failed to create specific drag icon:", error);
    return createGenericIcon();
  }
};

const createGenericIcon = () => {
  try {
    // Create a simple colored square as a fallback icon
    const canvas = { width: 32, height: 32 };
    const bitmap = Buffer.alloc(canvas.width * canvas.height * 4);

    // Fill with a semi-transparent blue color (RGBA)
    for (let i = 0; i < bitmap.length; i += 4) {
      bitmap[i] = 100; // R
      bitmap[i + 1] = 150; // G
      bitmap[i + 2] = 255; // B
      bitmap[i + 3] = 200; // A
    }

    return nativeImage.createFromBuffer(bitmap, canvas);
  } catch (error) {
    console.warn("Failed to create generic icon:", error);
    // Return empty image as final fallback
    return nativeImage.createEmpty();
  }
};

export const osHandlers = prefixNamespaceObject(namespace, handlers);
