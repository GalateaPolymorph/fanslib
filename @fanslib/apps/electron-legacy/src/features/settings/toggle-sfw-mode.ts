import { Settings } from "./entity";
import { loadSettings } from "./load";
import { saveSettings } from "./save";

export const toggleSfwMode = async (): Promise<Settings> => {
  const currentSettings = await loadSettings();
  const updatedSettings = {
    ...currentSettings,
    sfwMode: !currentSettings.sfwMode,
  };
  return await saveSettings(updatedSettings);
};
