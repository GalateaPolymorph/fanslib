import { useEffect, useRef, useState } from "react";
import { Media } from "../../../lib/database/media/type";

interface UseLibraryResult {
  media: Media[];
  scanning: boolean;
  error: string | null;
}

interface LibraryFilters {
  isNew?: boolean;
  categories?: string[]; // Array of category slugs to filter by
}

export function useLibrary(libraryPath: string, filters?: LibraryFilters): UseLibraryResult {
  const mounted = useRef(false);
  const [media, setMedia] = useState<Media[]>([]);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filterMedia = (allMedia: Media[]) => {
    let filteredMedia = allMedia;

    // Filter by isNew if specified
    if (filters?.isNew !== undefined) {
      filteredMedia = filteredMedia.filter((item) => item.isNew === filters.isNew);
    }

    // Filter by categories if specified
    if (filters?.categories?.length) {
      filteredMedia = filteredMedia.filter((item) =>
        // Check if the media has at least one category from the filter
        item.categories?.some((category) => filters.categories?.includes(category.slug))
      );
    }

    return filteredMedia;
  };

  useEffect(() => {
    const scanLibrary = async () => {
      try {
        setScanning(true);
        setError(null);
        console.log("Scanning library...");
        const allMedia = await window.api.library.scan(libraryPath);
        console.log(allMedia);
        setMedia(allMedia);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to scan library");
      } finally {
        setScanning(false);
      }
    };

    scanLibrary();

    const handleLibraryChange = (_event: any, allMedia: Media[]) => {
      setMedia(filterMedia(allMedia));
    };

    if (!mounted.current) {
      mounted.current = true;
      window.api.library.onLibraryChanged(handleLibraryChange);
      return;
    }

    return () => {
      window.api.library.offLibraryChanged(handleLibraryChange);
    };
  }, [libraryPath, filters?.isNew, filters?.categories]);

  return { media: filterMedia(media), scanning, error };
}
