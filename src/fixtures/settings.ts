import path from "path";
import { DEFAULT_SETTINGS } from "../features/settings/entity";
import { saveSettings } from "../features/settings/save";

export const loadSettingsFixtures = async () => {
  const fixtureSettings = {
    ...DEFAULT_SETTINGS,
    libraryPath: path.join(process.cwd(), "src", "fixtures", "media"),
  };

  await saveSettings(fixtureSettings);
  return fixtureSettings;
};
