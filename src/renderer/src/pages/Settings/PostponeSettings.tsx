import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { useSettings } from "@renderer/contexts/SettingsContext";
import { useCallback } from "react";

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
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="postpone-token">Postpone Token</Label>
        <Input
          type="password"
          id="postpone-token"
          placeholder="Enter your Postpone API token"
          value={settings?.postponeToken ?? ""}
          onChange={(e) => updatePostponeToken(e.target.value)}
        />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="bluesky-username">Bluesky Username</Label>
        <Input
          type="text"
          id="bluesky-username"
          placeholder="your.handle"
          value={settings?.blueskyUsername ?? ""}
          onChange={(e) => updateBlueskyUsername(e.target.value)}
        />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="bluesky-default-expiry-days">Bluesky Default Expiry (Days)</Label>
        <Input
          type="number"
          id="bluesky-default-expiry-days"
          placeholder="7"
          min="1"
          max="365"
          value={settings?.blueskyDefaultExpiryDays ?? 7}
          onChange={(e) => updateBlueskyDefaultExpiryDays(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Number of days after which Bluesky posts sent to Postpone will be automatically removed
          (1-365 days)
        </p>
      </div>
    </div>
  );
};
