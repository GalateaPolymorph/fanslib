import { Settings2 } from "lucide-react";
import { useShootPreferences } from "../../contexts/ShootPreferencesContext";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Switch } from "../ui/switch";

export const ShootViewSettings = () => {
  const { preferences, updatePreferences } = useShootPreferences();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>View Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium" htmlFor="group-by-category">
              Group by category
            </label>
            <Switch
              id="group-by-category"
              checked={preferences.groupByCategory}
              onCheckedChange={(checked) => updatePreferences({ groupByCategory: checked })}
            />
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
