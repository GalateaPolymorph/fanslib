import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type Settings = {
  libraryPath: string | null;
  theme: "light" | "dark";
  blueskyUsername?: string;
  postponeToken?: string;
  blueskyDefaultExpiryDays?: number;
  sfwMode: boolean;
  sfwBlurIntensity: number;
  sfwDefaultMode: "off" | "on" | "remember";
  sfwHoverDelay: number;
  backgroundJobsServerUrl?: string;
};

type SettingsContextType = {
  settings: Settings | null;
  loading: boolean;
  saveSettings: (updatedSettings: Partial<Settings>) => void;
  toggleSfwMode: () => void;
  setSfwBlurIntensity: (intensity: number) => void;
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

  const loadSettings = async () => {
    const loadedSettings = await window.api["settings:load"]();
    const initialSettings = { ...loadedSettings };

    if (loadedSettings.sfwDefaultMode === "on") {
      initialSettings.sfwMode = true;
    } else if (loadedSettings.sfwDefaultMode === "off") {
      initialSettings.sfwMode = false;
    }

    setSettings(initialSettings);
    setLoading(false);
  };

  const saveSettings = (updatedSettings: Partial<Settings>) => {
    const newSettings = { ...settings, ...updatedSettings };
    setSettings(newSettings);
    window.api["settings:save"](newSettings);
  };

  const toggleSfwMode = () => {
    if (settings) {
      const newSfwMode = !settings.sfwMode;
      const newSettings = { ...settings, sfwMode: newSfwMode };
      setSettings(newSettings);
      window.api["settings:save"](newSettings);
    }
  };

  const setSfwBlurIntensity = (intensity: number) => {
    if (settings) {
      const newSettings = { ...settings, sfwBlurIntensity: intensity };
      setSettings(newSettings);
      window.api["settings:save"](newSettings);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    const handleSettingsChanged = () => {
      loadSettings();
    };

    window.electron.ipcRenderer.on("settings-changed", handleSettingsChanged);
    return () => {
      window.electron.ipcRenderer.removeListener("settings-changed", handleSettingsChanged);
    };
  }, []);

  return (
    <SettingsContext.Provider
      value={{ settings, loading, saveSettings, toggleSfwMode, setSfwBlurIntensity }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
