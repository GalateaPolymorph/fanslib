import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { MediaSort } from "../../../features/library/api-type";

type GridSize = "small" | "large";

type ViewPreferences = {
  gridSize: GridSize;
};

type FilterPreferences = {
  categories?: string[];
  unposted?: boolean;
  search?: string;
  excludeShoots?: string[];
};

type SortPreferences = MediaSort;

type PaginationPreferences = {
  page: number;
  limit: number;
};

export type LibraryPreferences = {
  view: ViewPreferences;
  filter: FilterPreferences;
  sort: SortPreferences;
  pagination: PaginationPreferences;
};

interface LibraryPreferencesContextValue {
  preferences: LibraryPreferences;
  updateViewPreferences: (updates: Partial<ViewPreferences>) => void;
  updateFilterPreferences: (updates: Partial<FilterPreferences>) => void;
  updateSortPreferences: (updates: Partial<SortPreferences>) => void;
  updatePaginationPreferences: (updates: Partial<PaginationPreferences>) => void;
}

const defaultPreferences: LibraryPreferences = {
  view: {
    gridSize: "large",
  },
  filter: {
    search: "",
    excludeShoots: [],
  },
  sort: {
    field: "fileModificationDate",
    direction: "DESC",
  },
  pagination: {
    page: 1,
    limit: 50,
  },
};

const LibraryPreferencesContext = createContext<LibraryPreferencesContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "libraryPreferences";

export const LibraryPreferencesProvider = ({ children }: { children: React.ReactNode }) => {
  const [preferences, setPreferences] = useState<LibraryPreferences>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return {
          view: { ...defaultPreferences.view, ...parsed.view },
          filter: { ...defaultPreferences.filter, ...parsed.filter },
          sort: { ...defaultPreferences.sort, ...parsed.sort },
          pagination: { ...defaultPreferences.pagination, ...parsed.pagination },
        };
      } catch (error) {
        console.error("Failed to parse library preferences:", error);
        return defaultPreferences;
      }
    }
    return defaultPreferences;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  const updateViewPreferences = useCallback((updates: Partial<ViewPreferences>) => {
    setPreferences((prev) => ({
      ...prev,
      view: { ...prev.view, ...updates },
    }));
  }, []);

  const updateFilterPreferences = useCallback((updates: Partial<FilterPreferences>) => {
    setPreferences((prev) => ({
      ...prev,
      filter: { ...prev.filter, ...updates },
    }));
  }, []);

  const updateSortPreferences = useCallback((updates: Partial<SortPreferences>) => {
    setPreferences((prev) => ({
      ...prev,
      sort: { ...prev.sort, ...updates },
    }));
  }, []);

  const updatePaginationPreferences = useCallback((updates: Partial<PaginationPreferences>) => {
    setPreferences((prev) => ({
      ...prev,
      pagination: { ...prev.pagination, ...updates },
    }));
  }, []);

  return (
    <LibraryPreferencesContext.Provider
      value={{
        preferences,
        updateViewPreferences,
        updateFilterPreferences,
        updateSortPreferences,
        updatePaginationPreferences,
      }}
    >
      {children}
    </LibraryPreferencesContext.Provider>
  );
};

export const useLibraryPreferences = () => {
  const context = useContext(LibraryPreferencesContext);
  if (!context) {
    throw new Error("useLibraryPreferences must be used within a LibraryPreferencesProvider");
  }
  return context;
};
