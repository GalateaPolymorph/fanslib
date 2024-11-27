import { Gallery } from "../components/Gallery";
import { WelcomeScreen } from "../components/WelcomeScreen";
import { useSettings } from "../contexts/SettingsContext";

export const ContentPage = () => {
  const { settings, loading } = useSettings();

  if (loading) {
    return null;
  }

  if (!settings?.libraryPath) {
    return <WelcomeScreen />;
  }

  return <Gallery libraryPath={settings.libraryPath} />;
};
