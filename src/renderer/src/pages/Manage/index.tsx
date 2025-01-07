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
      mainContent={<Library />}
      sideContent={<Shoots />}
      sideContentHeader={<h1 className="text-2xl font-bold">Shoots</h1>}
      mainDefaultSize={50}
      sideDefaultSize={50}
      sideMaxSize={50}
    />
  );
};
