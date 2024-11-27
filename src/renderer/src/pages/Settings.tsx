import { LibraryPathInput } from "@renderer/components/LibraryPathInput";
import { SettingsSection } from "@renderer/components/SettingsSection";
import { Separator } from "@renderer/components/ui/separator";
import { ThemeSwitch } from "@renderer/components/ThemeSwitch";

export const SettingsPage = () => {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your library and application preferences.
        </p>
      </div>
      
      <Separator />
      
      <div className="space-y-8">
        <SettingsSection
          title="Library"
          description="Configure your library location and organization preferences."
        >
          <LibraryPathInput />
        </SettingsSection>

        <SettingsSection
          title="Appearance"
          description="Customize how FansLib looks and feels."
        >
          <ThemeSwitch />
        </SettingsSection>
      </div>
    </div>
  );
};
