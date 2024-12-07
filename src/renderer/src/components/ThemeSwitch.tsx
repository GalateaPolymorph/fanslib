import { useTheme } from "./ThemeProvider";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

export const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (checked: boolean) => {
    const newTheme = checked ? "dark" : "light";
    setTheme(newTheme);
    window.api["settings:save"]({ theme: newTheme });
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch id="theme-mode" checked={theme === "dark"} onCheckedChange={handleThemeChange} />
      <Label htmlFor="theme-mode">Dark Mode</Label>
    </div>
  );
};
