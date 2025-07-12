import { Card } from "@renderer/components/ui/Card";
import { Input } from "@renderer/components/ui/Input";
import { Label } from "@renderer/components/ui/Label";
import { RadioGroup, RadioGroupItem } from "@renderer/components/ui/RadioGroup";
import { Slider } from "@renderer/components/ui/Slider";
import { Switch } from "@renderer/components/ui/Switch";
import { useSettings } from "@renderer/contexts/SettingsContext";
import { useSfwMode } from "@renderer/hooks/ui/useSfwMode";
import { cn } from "@renderer/lib/utils";
import { useState } from "react";
import { SettingRow } from "./SettingRow";

export const SfwModeSettings = () => {
  const { settings, saveSettings, toggleSfwMode, setSfwBlurIntensity } = useSettings();
  const [previewBlur, setPreviewBlur] = useState(settings?.sfwBlurIntensity || 5);
  const { handleMouseEnter, handleMouseLeave, getBlurClassName } = useSfwMode();

  if (!settings) return null;

  const handleBlurIntensityChange = (values: number[]) => {
    const intensity = values[0];
    setPreviewBlur(intensity);
    setSfwBlurIntensity(intensity);
  };

  const handleHoverDelayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const delay = parseInt(event.target.value) || 0;
    saveSettings({ sfwHoverDelay: delay });
  };

  const handleDefaultModeChange = (value: string) => {
    saveSettings({ sfwDefaultMode: value as "off" | "on" | "remember" });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <SettingRow
          title="Enable SFW Mode"
          description="Blur all media content throughout the application"
          descriptionSlot={
            <p className="text-sm text-muted-foreground">
              Use <strong>Cmd/Ctrl + Shift + S</strong> to toggle quickly.
            </p>
          }
        >
          <Switch id="sfw-mode" checked={settings.sfwMode} onCheckedChange={toggleSfwMode} />
        </SettingRow>

        <SettingRow
          title="Blur Intensity"
          description="Adjust how much content is blurred (1 = light, 10 = heavy)"
          variant="secondary"
        >
          <div className="space-y-2 w-full">
            <Slider
              value={[previewBlur]}
              onValueChange={handleBlurIntensityChange}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="text-sm text-muted-foreground">Current: {previewBlur}</div>
          </div>
        </SettingRow>

        <SettingRow
          title="Hover Delay"
          variant="secondary"
          description="How long to wait before revealing content on hover (0 = instant)"
        >
          <Input
            id="hover-delay"
            type="number"
            value={settings.sfwHoverDelay}
            onChange={handleHoverDelayChange}
            min="0"
            max="2000"
            step="50"
            className="w-24"
            placeholder="ms"
          />
        </SettingRow>

        <SettingRow
          title="Live Preview"
          variant="secondary"
          description={`Preview of blur effect at current intensity. ${
            settings.sfwMode ? "Hover to test delay setting." : "Enable SFW mode to see effect."
          }`}
        >
          <Card className="p-4 overflow-hidden w-full max-w-sm">
            <div className="relative">
              <div
                className={cn(
                  "w-full h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md cursor-pointer",
                  settings.sfwMode ? getBlurClassName() : ""
                )}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-white font-medium">Sample Content</span>
              </div>
            </div>
          </Card>
        </SettingRow>

        <SettingRow
          title="Default Behavior"
          variant="secondary"
          description="How SFW mode should behave when the application starts"
        >
          <RadioGroup
            value={settings.sfwDefaultMode}
            onValueChange={handleDefaultModeChange}
            className="grid grid-cols-1 gap-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="off" id="default-off" />
              <Label htmlFor="default-off">Always start with SFW mode OFF</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="on" id="default-on" />
              <Label htmlFor="default-on">Always start with SFW mode ON</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="remember" id="default-remember" />
              <Label htmlFor="default-remember">Remember last setting</Label>
            </div>
          </RadioGroup>
        </SettingRow>
      </div>
    </div>
  );
};
