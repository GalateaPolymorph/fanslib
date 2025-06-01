import { DeepPartial } from "@renderer/lib/deep-partial";
import { mergeDeepRight } from "ramda";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { MediaFilters, MediaSort } from "../../../features/library/api-type";

export type GridSize = "small" | "large";

type ViewPreferences = {
  gridSize: GridSize;
};

type SortPreferences = MediaSort;

type PaginationPreferences = {
  page: number;
  limit: number;
};

export type LibraryPreferences = {
  view: ViewPreferences;
  filter: MediaFilters;
  sort: SortPreferences;
  pagination: PaginationPreferences;
};

const defaultPreferences: LibraryPreferences = {
  view: {
    gridSize: "large",
  },
  filter: [],
  sort: {
    field: "fileModificationDate",
    direction: "DESC",
  },
  pagination: {
    page: 1,
    limit: 50,
  },
};

type LibraryPreferencesContextValue = {
  preferences: LibraryPreferences;
  updatePreferences: (updates: DeepPartial<LibraryPreferences>) => void;
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
        return mergeDeepRight(defaultPreferences, JSON.parse(stored));
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

  const updatePreferences = useCallback((updates: DeepPartial<LibraryPreferences>) => {
    setPreferences((prev) => {
      console.log("prev", prev, updates);
      return mergeDeepRight(prev, updates) as LibraryPreferences;
    });
  }, []);

  return (
    <LibraryPreferencesContext.Provider
      value={{
        preferences,
        updatePreferences,
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
