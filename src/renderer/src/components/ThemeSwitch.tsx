import { useTheme } from "./ThemeProvider";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

export const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();

  const updateTheme = async (checked: boolean) => {
    const newTheme = checked ? "dark" : "light";
    setTheme(newTheme);

    try {
      await window.api["settings:save"]({ theme: newTheme });
    } catch (error) {
      console.error("Failed to save theme preference:", error);
      // Revert theme on save failure
      setTheme(theme);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch id="theme-mode" checked={theme === "dark"} onCheckedChange={updateTheme} />
      <Label htmlFor="theme-mode">Dark Mode</Label>
    </div>
  );
};
