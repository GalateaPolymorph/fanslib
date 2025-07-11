import { ThemeSwitch } from "@renderer/components/ThemeSwitch";
import { Palette } from "lucide-react";
import { SettingRow } from "./SettingRow";

export const AppearanceSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold">
          <Palette /> Appearance
        </h1>
        <p className="text-muted-foreground">Customize the look and feel of your application</p>
      </div>

      <div className="space-y-2">
        <SettingRow
          title="Theme"
          description="Choose between light and dark themes. The theme will be applied across the entire application."
        >
          <ThemeSwitch />
        </SettingRow>
      </div>
    </div>
  );
};
