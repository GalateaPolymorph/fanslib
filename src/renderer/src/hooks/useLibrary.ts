import { useEffect, useState } from "react";
import { GetAllMediaParams, PaginatedResponse } from "../../../features/library/api-type";
import { Media } from "../../../features/library/entity";
import { useSettings } from "../contexts/SettingsContext";

interface UseLibraryResult {
  media: Media[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  error: string | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

interface LibraryFilters {
  categories?: string[];
  page?: number;
  limit?: number;
}

export function useLibrary(filters?: LibraryFilters): UseLibraryResult {
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
      const params: GetAllMediaParams = {
        page: filters?.page ?? 1,
        limit: filters?.limit ?? 50,
      };

      if (filters?.categories?.length) {
        params.filters = {
          categories: filters.categories,
        };
      }

      const response = await window.api["library:getAll"](params);
      setMediaData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load media");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, [libraryPath, filters?.categories, filters?.page, filters?.limit]);

  return {
    media: mediaData.items,
    totalItems: mediaData.total,
    currentPage: mediaData.page,
    totalPages: mediaData.totalPages,
    error,
    isLoading,
    refetch: fetchLibrary,
  };
}
