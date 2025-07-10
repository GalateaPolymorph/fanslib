import { ThemeSwitch } from "@renderer/components/ThemeSwitch";
import { Separator } from "@renderer/components/ui/separator";
import { ResetDatabaseButton } from "@renderer/pages/Settings/ResetDatabaseButton";
import { SettingsSection } from "@renderer/pages/Settings/SettingsSection";
import { FanslySettings } from "./FanslySettings";
import { LibraryPathInput } from "./LibraryPathInput";
import { PathMigration } from "./PathMigration";
import { PostponeSettings } from "./PostponeSettings";

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
          <div className="space-y-4">
            <LibraryPathInput />
            <PathMigration />
          </div>
        </SettingsSection>

        <SettingsSection title="Appearance" description="Customize how FansLib looks and feels.">
          <ThemeSwitch />
        </SettingsSection>

        <SettingsSection
          title="Fansly Analytics"
          description="Configure your Fansly authentication for analytics data fetching."
        >
          <FanslySettings />
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
