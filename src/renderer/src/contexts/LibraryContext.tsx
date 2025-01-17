import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { PaginatedResponse } from "../../../features/_common/pagination";
import { GetAllMediaParams } from "../../../features/library/api-type";
import { Media } from "../../../features/library/entity";
import { useLibraryPreferences } from "./LibraryPreferencesContext";
import { useSettings } from "./SettingsContext";

type LibraryContextType = {
  media: Media[];
  totalItems: number;
  totalPages: number;
  error: string | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
};

const LibraryContext = createContext<LibraryContextType | null>(null);

type LibraryProviderProps = {
  children: ReactNode;
};

export const LibraryProvider = ({ children }: LibraryProviderProps) => {
  const { settings } = useSettings();
  const libraryPath = settings?.libraryPath;
  const { preferences } = useLibraryPreferences();
  const [mediaData, setMediaData] = useState<PaginatedResponse<Media>>({
    items: [],
    total: 0,
    page: 1,
    limit: 50,
    totalPages: 1,
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLibrary = useCallback(async () => {
    if (!libraryPath) return;

    setIsLoading(true);
    try {
      setError(null);

      const params: GetAllMediaParams = {
        page: preferences.pagination.page,
        limit: preferences.pagination.limit,
        sort: preferences.sort,
        ...preferences.filter,
      };

      const result = await window.api["library:getAll"](params);
      setMediaData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch library");
    } finally {
      setIsLoading(false);
    }
  }, [libraryPath, preferences]);

  useEffect(() => {
    fetchLibrary();
  }, [fetchLibrary]);

  return (
    <LibraryContext.Provider
      value={{
        media: mediaData.items,
        totalItems: mediaData.total,
        totalPages: mediaData.totalPages,
        error,
        isLoading,
        refetch: fetchLibrary,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error("useLibrary must be used within a LibraryProvider");
  }
  return context;
};
