import { createContext, useContext, useEffect, useState } from "react";

type ShootViewPreferences = {
  groupByCategory: boolean;
};

const defaultPreferences: ShootViewPreferences = {
  groupByCategory: true,
};

type ShootPreferencesContextType = {
  preferences: ShootViewPreferences;
  updatePreferences: (preferences: Partial<ShootViewPreferences>) => void;
};

const ShootPreferencesContext = createContext<ShootPreferencesContextType | null>(null);

const STORAGE_KEY = "shoot-preferences";

export const ShootPreferencesProvider = ({ children }: { children: React.ReactNode }) => {
  const [preferences, setPreferences] = useState<ShootViewPreferences>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return { ...defaultPreferences, ...JSON.parse(stored) };
      } catch {
        return defaultPreferences;
      }
    }
    return defaultPreferences;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  const updatePreferences = (newPreferences: Partial<ShootViewPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...newPreferences }));
  };

  return (
    <ShootPreferencesContext.Provider value={{ preferences, updatePreferences }}>
      {children}
    </ShootPreferencesContext.Provider>
  );
};

export const useShootPreferences = () => {
  const context = useContext(ShootPreferencesContext);
  if (!context) {
    throw new Error("useShootPreferences must be used within a ShootPreferencesProvider");
  }
  return context;
};
