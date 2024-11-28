import { promises as fs } from "fs";
import path from "path";

export async function* walkDirectory(dir: string): AsyncGenerator<string> {
  if (!dir || dir.trim() === "") {
    return;
  }

  try {
    const normalizedPath = path.resolve(dir);

    // Check if directory exists and is accessible
    const accessible = await fs.access(normalizedPath).catch(() => {
      console.warn(`Cannot access directory: ${normalizedPath}`);
      return false;
    });
    if (!accessible) {
      return;
    }

    // Verify it's a directory
    const stats = await fs.stat(normalizedPath);
    if (!stats.isDirectory()) {
      console.warn(`Path is not a directory: ${normalizedPath}`);
      return;
    }

    const entries = await fs.readdir(normalizedPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(normalizedPath, entry.name);

      if (entry.isDirectory()) {
        yield* walkDirectory(fullPath);
      } else if (entry.isFile()) {
        yield fullPath;
      }
    }
  } catch (error) {
    console.error(`Unexpected error walking directory ${dir}:`, error);
    // Rethrow unexpected errors
    throw error;
  }
}
