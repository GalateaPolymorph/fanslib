import { useEffect, useState } from "react";
import { MediaFile } from "../../../features/library/shared/types";

interface UseLibraryResult {
  mediaFiles: MediaFile[];
  scanning: boolean;
  error: string | null;
}

export function useLibrary(libraryPath: string): UseLibraryResult {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const scanLibrary = async () => {
      try {
        setScanning(true);
        setError(null);
        const files = await window.api.library.scan(libraryPath);
        setMediaFiles(files);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to scan library");
      } finally {
        setScanning(false);
      }
    };

    scanLibrary();

    const handleLibraryChange = (_event: any, files: MediaFile[]) => {
      setMediaFiles(files);
    };

    window.api.library.onLibraryChanged(handleLibraryChange);

    return () => {
      window.api.library.removeLibraryChangeListener(handleLibraryChange);
    };
  }, [libraryPath]);

  return { mediaFiles, scanning, error };
}
