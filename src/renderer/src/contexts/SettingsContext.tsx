import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type Settings = {
  libraryPath: string | null;
  theme: "light" | "dark";
  blueskyUsername?: string;
  postponeToken?: string;
  blueskyDefaultExpiryDays?: number;
};

type SettingsContextType = {
  settings: Settings | null;
  loading: boolean;
  saveSettings: (updatedSettings: Partial<Settings>) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

type SettingsProviderProps = {
  children: ReactNode;
};

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  const saveSettings = (updatedSettings: Partial<Settings>) => {
    const newSettings = { ...settings, ...updatedSettings };
    setSettings(newSettings);
    window.api["settings:save"](newSettings);
  };

  useEffect(() => {
    console.log("🔍 [DEBUG] SettingsContext: Loading settings...");
    window.api["settings:load"]().then((loadedSettings) => {
      console.log("🔍 [DEBUG] SettingsContext: Loaded settings:", loadedSettings);
      console.log("🔍 [DEBUG] SettingsContext: Library path:", loadedSettings?.libraryPath);
      setSettings(loadedSettings);
      setLoading(false);
    });
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
