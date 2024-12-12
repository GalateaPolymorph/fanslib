import { useEffect, useState } from "react";
import { GetAllMediaParams, PaginatedResponse } from "../../../features/library/api-type";
import { Media } from "../../../features/library/entity";
import { useSettings } from "../contexts/SettingsContext";

type UseLibraryResult = {
  media: Media[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  error: string | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
};

export const useLibrary = (filters?: GetAllMediaParams): UseLibraryResult => {
  const { settings } = useSettings();
  const libraryPath = settings?.libraryPath;
  const [mediaData, setMediaData] = useState<PaginatedResponse<Media>>({
    items: [],
    total: 0,
    page: 1,
    limit: 50,
    totalPages: 1,
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLibrary = async () => {
    if (!libraryPath) return;

    setIsLoading(true);
    try {
      setError(null);

      const response = await window.api["library:getAll"](filters);

      setMediaData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load media");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, [libraryPath, JSON.stringify(filters)]);

  return {
    media: mediaData.items,
    totalItems: mediaData.total,
    currentPage: mediaData.page,
    totalPages: mediaData.totalPages,
    error,
    isLoading,
    refetch: fetchLibrary,
  };
};
