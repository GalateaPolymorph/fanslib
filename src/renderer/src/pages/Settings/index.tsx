import { ThemeSwitch } from "@renderer/components/ThemeSwitch";
import { Separator } from "@renderer/components/ui/separator";
import { FanslySettings } from "./FanslySettings";
import { LibraryPathInput } from "./LibraryPathInput";
import { PostponeSettings } from "./PostponeSettings";
import { SfwModeSettings } from "./SfwModeSettings";

export const Settings = () => {
  return (
    <div className="p-6 max-w-2xl">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Settings</h2>
          <p className="text-sm text-muted-foreground">Configure your application preferences</p>
        </div>

        <Separator />

        <LibraryPathInput />
        <ThemeSwitch />

        <Separator />

        <SfwModeSettings />

        <Separator />

        <FanslySettings />

        <Separator />

        <PostponeSettings />
      </div>
    </div>
  );
};
