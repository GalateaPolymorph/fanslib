import { useEffect, useState } from "react";
import { PaginatedResponse } from "../../../features/_common/pagination";
import { GetAllMediaParams } from "../../../features/library/api-type";
import { Media } from "../../../features/library/entity";
import { LibraryPreferences } from "../contexts/LibraryPreferencesContext";
import { useSettings } from "../contexts/SettingsContext";

type UseLibraryResult = {
  media: Media[];
  totalItems: number;
  totalPages: number;
  error: string | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
};

export const useLibrary = (
  preferences: Pick<LibraryPreferences, "sort" | "filter" | "pagination">
): UseLibraryResult => {
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
      console.log(preferences.filter);

      const params: GetAllMediaParams = {
        page: preferences.pagination.page,
        limit: preferences.pagination.limit,

        categories: preferences.filter.categories,
        search: preferences.filter.search,
        unposted: preferences.filter.unposted,
        excludeShoots: preferences.filter.excludeShoots,

        sort: {
          field: preferences.sort.field,
          direction: preferences.sort.direction,
        },
      };

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
  }, [libraryPath, JSON.stringify(preferences)]);

  return {
    media: mediaData.items,
    totalItems: mediaData.total,
    totalPages: mediaData.totalPages,
    error,
    isLoading,
    refetch: fetchLibrary,
  };
};
