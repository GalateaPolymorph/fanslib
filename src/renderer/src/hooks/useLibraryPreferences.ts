import { useCallback, useEffect, useState } from "react";
import { MediaSort } from "../../../features/library/api-type";

interface LibraryPreferences {
  categories?: string[] | undefined;
  unposted?: boolean;
  sort: MediaSort;
  gridSize: "large" | "small";
  page: number;
  limit: number;
}

const defaultPreferences: LibraryPreferences = {
  sort: {
    field: "fileModificationDate",
    direction: "DESC",
  },
  gridSize: "large",
  page: 1,
  limit: 50,
};

const STORAGE_KEY = "libraryPreferences";

export function useLibraryPreferences() {
  const [preferences, setPreferences] = useState<LibraryPreferences>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return {
          ...defaultPreferences,
          ...parsed,
          // Ensure sort has both field and direction
          sort: {
            ...defaultPreferences.sort,
            ...parsed.sort,
          },
        };
      } catch (error) {
        console.error("Failed to parse library preferences:", error);
      }
    }
    return defaultPreferences;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  const updatePreferences = useCallback((updates: Partial<LibraryPreferences>) => {
    setPreferences((prev) => {
      console.log("Updating library preferences:", prev, updates);

      return { ...prev, ...updates };
    });
  }, []);

  return {
    preferences,
    updatePreferences,
  };
}
