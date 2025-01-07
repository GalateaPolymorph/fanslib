import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type Settings = {
  libraryPath: string | null;
};

type SettingsContextType = {
  settings: Settings | null;
  loading: boolean;
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

  useEffect(() => {
    window.api["settings:load"]().then((loadedSettings) => {
      setSettings(loadedSettings);
      setLoading(false);
    });
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>{children}</SettingsContext.Provider>
  );
};
