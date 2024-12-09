import { exec } from "child_process";
import { app } from "electron";
import ffprobe from "ffprobe-static";
import path from "path";
import { promisify } from "util";

const execAsync = promisify(exec);

export function getFfprobePath(): string {
  if (app.isPackaged) {
    // In packaged app, binaries are in Resources directory
    const resourcesPath =
      process.platform === "darwin"
        ? path.join(process.resourcesPath, "Resources")
        : process.resourcesPath;
    return path.join(resourcesPath, "ffprobe");
  }
  // In development, use the one from node_modules
  return ffprobe.path;
}

export async function getVideoDuration(filePath: string): Promise<number | undefined> {
  try {
    const ffprobePath = getFfprobePath();

    const { stdout } = await execAsync(
      `"${ffprobePath}" -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`
    );
    const duration = parseFloat(stdout.trim());
    return isNaN(duration) ? undefined : duration;
  } catch (error) {
    console.error(`Failed to get duration for ${filePath}:`, error);
    return undefined;
  }
}
