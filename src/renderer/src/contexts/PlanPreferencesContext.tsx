import { DeepPartial } from "@renderer/lib/deep-partial";
import { mergeDeepRight } from "ramda";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type PlanViewType = "timeline" | "calendar";

type ViewPreferences = {
  viewType: PlanViewType;
};

export type PlanPreferences = {
  view: ViewPreferences;
};

const defaultPreferences: PlanPreferences = {
  view: {
    viewType: "timeline",
  },
};

type PlanPreferencesContextValue = {
  preferences: PlanPreferences;
  updatePreferences: (updates: DeepPartial<PlanPreferences>) => void;
};

const PlanPreferencesContext = createContext<PlanPreferencesContextValue | undefined>(undefined);

const STORAGE_KEY = "planPreferences";

export const PlanPreferencesProvider = ({ children }: { children: React.ReactNode }) => {
  const [preferences, setPreferences] = useState<PlanPreferences>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return mergeDeepRight(defaultPreferences, JSON.parse(stored));
      } catch (error) {
        console.error("Failed to parse plan preferences:", error);
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
