import { Card } from "@renderer/components/ui/card";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@renderer/components/ui/radio-group";
import { Separator } from "@renderer/components/ui/separator";
import { Slider } from "@renderer/components/ui/slider";
import { Switch } from "@renderer/components/ui/switch";
import { useSettings } from "@renderer/contexts/SettingsContext";
import { useSfwMode } from "@renderer/hooks/ui/useSfwMode";
import { cn } from "@renderer/lib/utils";
import { useState } from "react";

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
      <div>
        <h3 className="text-lg font-semibold">SFW Mode</h3>
        <p className="text-sm text-muted-foreground">
          Configure safe-for-work mode to blur media content. Use Cmd/Ctrl + Shift + S to toggle
          quickly.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="sfw-mode">Enable SFW Mode</Label>
            <p className="text-sm text-muted-foreground">
              Blur all media content throughout the application
            </p>
          </div>
          <Switch id="sfw-mode" checked={settings.sfwMode} onCheckedChange={toggleSfwMode} />
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Blur Intensity</Label>
            <p className="text-sm text-muted-foreground">
              Adjust how much content is blurred (1 = light, 10 = heavy)
            </p>
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

          <div className="space-y-2">
            <Label htmlFor="hover-delay">Hover Delay (ms)</Label>
            <p className="text-sm text-muted-foreground">
              How long to wait before revealing content on hover (0 = instant)
            </p>
            <Input
              id="hover-delay"
              type="number"
              value={settings.sfwHoverDelay}
              onChange={handleHoverDelayChange}
              min="0"
              max="2000"
              step="50"
              className="w-24"
            />
          </div>

          <div className="space-y-2">
            <Label>Live Preview</Label>
            <p className="text-sm text-muted-foreground">
              Preview of blur effect at current intensity.{" "}
              {settings.sfwMode ? "Hover to test delay setting." : "Enable SFW mode to see effect."}
            </p>
            <Card className="p-4 overflow-hidden">
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
          </div>

          <div className="space-y-3">
            <Label>Default Behavior</Label>
            <p className="text-sm text-muted-foreground">
              How SFW mode should behave when the application starts
            </p>
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
          </div>
        </div>
      </div>
    </div>
  );
};
