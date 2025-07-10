import * as path from "path";

// Convert relative path to absolute path using library path
export const convertRelativeToAbsolute = (relativePath: string, libraryPath: string): string => {
  if (path.isAbsolute(relativePath)) {
    return relativePath;
  }

  return path.join(libraryPath, relativePath);
};
