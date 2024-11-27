import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { useTheme } from "./ThemeProvider";

export const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (checked: boolean) => {
    const newTheme = checked ? "dark" : "light";
    setTheme(newTheme);
    window.api.settingsSave({ theme: newTheme });
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="theme-mode"
        checked={theme === "dark"}
        onCheckedChange={handleThemeChange}
      />
      <Label htmlFor="theme-mode">Dark Mode</Label>
    </div>
  );
};
