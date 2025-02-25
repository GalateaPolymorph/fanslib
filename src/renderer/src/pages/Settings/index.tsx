import { ThemeSwitch } from "@renderer/components/ThemeSwitch";
import { Separator } from "@renderer/components/ui/separator";
import { ResetDatabaseButton } from "@renderer/pages/Settings/ResetDatabaseButton";
import { SettingsSection } from "@renderer/pages/Settings/SettingsSection";
import { CategorySettings } from "./CategorySettings";
import { LibraryPathInput } from "./LibraryPathInput";
import { PostponeSettings } from "./PostponeSettings";
import { TierSettings } from "./TierSettings";

export const SettingsPage = () => {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your library and application preferences.</p>
      </div>

      <Separator />

      <div className="space-y-16">
        <SettingsSection
          title="Library"
          description="Configure your library location and organization preferences."
        >
          <LibraryPathInput />
          <CategorySettings />
          <TierSettings />
        </SettingsSection>

        <SettingsSection title="Appearance" description="Customize how FansLib looks and feels.">
          <ThemeSwitch />
        </SettingsSection>

        <SettingsSection
          title="Postpone"
          description="Configure your Postpone integration settings."
        >
          <PostponeSettings />
        </SettingsSection>

        <SettingsSection
          title="Danger Zone"
          description="These actions are destructive and cannot be undone."
        >
          <ResetDatabaseButton />
        </SettingsSection>
      </div>
    </div>
  );
};
