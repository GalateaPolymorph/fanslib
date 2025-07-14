import { Library } from "../../components/Library";
import { Shoots } from "../../components/Shoots/Shoots";
import { SplitViewLayout } from "../../components/SplitViewLayout";
import { WelcomeScreen } from "../../components/WelcomeScreen";
import { useSettings } from "../../contexts/SettingsContext";

export const ManagePage = () => {
  const { settings, loading } = useSettings();

  if (loading) {
    return null;
  }

  if (!settings?.libraryPath) {
    return <WelcomeScreen />;
  }

  return (
    <SplitViewLayout
      id="manage-page"
      mainContent={<Library />}
      sideContent={<Shoots />}
      mainDefaultSize={50}
      sideDefaultSize={50}
      sideMaxSize={50}
    />
  );
};
