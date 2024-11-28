import { useEffect, useState } from "react";
import { Media } from "../../../features/library/shared/types";

interface UseLibraryResult {
  media: Media[];
  scanning: boolean;
  error: string | null;
}

export function useLibrary(libraryPath: string): UseLibraryResult {
  const [media, setMedia] = useState<Media[]>([]);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const scanLibrary = async () => {
      try {
        setScanning(true);
        setError(null);
        const media = await window.api.library.scan(libraryPath);
        setMedia(media);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to scan library");
      } finally {
        setScanning(false);
      }
    };

    scanLibrary();

    const handleLibraryChange = (_event: any, media: Media[]) => {
      setMedia(media);
    };

    window.api.library.onLibraryChanged(handleLibraryChange);

    return () => {
      window.api.library.removeLibraryChangeListener(handleLibraryChange);
    };
  }, [libraryPath]);

  return { media, scanning, error };
}
