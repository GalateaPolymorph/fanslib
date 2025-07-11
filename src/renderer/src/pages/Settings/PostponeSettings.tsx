import { Input } from "@renderer/components/ui/input";
import { useSettings } from "@renderer/contexts/SettingsContext";
import { useCallback } from "react";
import { SettingRow } from "./SettingRow";

export const PostponeSettings = () => {
  const { settings, saveSettings } = useSettings();

  const updateBlueskyUsername = useCallback(
    (username: string) => {
      saveSettings({ blueskyUsername: username });
    },
    [saveSettings]
  );

  const updatePostponeToken = useCallback(
    (token: string) => {
      saveSettings({ postponeToken: token });
    },
    [saveSettings]
  );

  const updateBlueskyDefaultExpiryDays = useCallback(
    (days: string) => {
      const numDays = parseInt(days, 10);
      saveSettings({ blueskyDefaultExpiryDays: isNaN(numDays) ? undefined : numDays });
    },
    [saveSettings]
  );

  return (
    <div className="space-y-4">
      <SettingRow
        title="Postpone Token"
        description="Enter your Postpone API token to enable content scheduling integration"
      >
        <Input
          type="password"
          id="postpone-token"
          placeholder="Enter your Postpone API token"
          value={settings?.postponeToken ?? ""}
          onChange={(e) => updatePostponeToken(e.target.value)}
          className="max-w-sm"
        />
      </SettingRow>
      
      <SettingRow
        title="Bluesky Username"
        description="Your Bluesky handle for cross-platform posting"
      >
        <Input
          type="text"
          id="bluesky-username"
          placeholder="your.handle"
          value={settings?.blueskyUsername ?? ""}
          onChange={(e) => updateBlueskyUsername(e.target.value)}
          className="max-w-sm"
        />
      </SettingRow>
      
      <SettingRow
        title="Bluesky Default Expiry"
        description="Number of days after which Bluesky posts sent to Postpone will be automatically removed (1-365 days)"
      >
        <Input
          type="number"
          id="bluesky-default-expiry-days"
          placeholder="7"
          min="1"
          max="365"
          value={settings?.blueskyDefaultExpiryDays ?? 7}
          onChange={(e) => updateBlueskyDefaultExpiryDays(e.target.value)}
          className="max-w-24"
        />
      </SettingRow>
    </div>
  );
};
