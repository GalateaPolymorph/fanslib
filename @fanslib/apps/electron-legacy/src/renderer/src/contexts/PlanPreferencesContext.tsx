import { DeepPartial } from "@renderer/lib/deep-partial";
import { addMonths, startOfMonth } from "date-fns";
import { mergeDeepRight } from "ramda";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { PostStatus } from "src/features/posts/entity";

export type PlanViewType = "timeline" | "calendar";

export type PlanFilterPreferences = {
  search?: string;
  channels?: string[];
  statuses?: PostStatus[];
  dateRange?: {
    startDate: string;
    endDate: string;
  };
};

export type PlanPreferences = {
  view: {
    viewType: PlanViewType;
    showCaptions: boolean;
  };
  filter: PlanFilterPreferences;
};

export const defaultPreferences: PlanPreferences = {
  view: {
    viewType: "timeline",
    showCaptions: false,
  },
  filter: {
    search: undefined,
    channels: undefined,
    statuses: undefined,
    dateRange: {
      startDate: startOfMonth(new Date()).toISOString(),
      endDate: addMonths(startOfMonth(new Date()), 3).toISOString(),
    },
  },
};

type PlanPreferencesContextValue = {
  preferences: PlanPreferences;
  updatePreferences: (updates: DeepPartial<PlanPreferences>) => void;
};

const PlanPreferencesContext = createContext<PlanPreferencesContextValue | undefined>(undefined);

const STORAGE_KEY = "postPreferences";

export const PlanPreferencesProvider = ({ children }: { children: React.ReactNode }) => {
  const [preferences, setPreferences] = useState<PlanPreferences>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return mergeDeepRight(defaultPreferences, JSON.parse(stored));
      } catch (error) {
        console.error("Failed to parse post preferences:", error);
        return defaultPreferences;
      }
    }
    return defaultPreferences;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  const updatePreferences = useCallback((updates: DeepPartial<PlanPreferences>) => {
    setPreferences((prev) => mergeDeepRight(prev, updates) as PlanPreferences);
  }, []);

  return (
    <PlanPreferencesContext.Provider
      value={{
        preferences,
        updatePreferences,
      }}
    >
      {children}
    </PlanPreferencesContext.Provider>
  );
};

export const usePlanPreferences = () => {
  const context = useContext(PlanPreferencesContext);
  if (!context) {
    throw new Error("usePlanPreferences must be used within a PlanPreferencesProvider");
  }
  return context;
};
