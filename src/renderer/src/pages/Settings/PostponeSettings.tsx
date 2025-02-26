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
    </div>
  );
};
