import { CalendarDays, LayoutList, Settings2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group";
import { PlanViewType, usePlanPreferences } from "../../contexts/PlanPreferencesContext";

export const PlanViewSettings = () => {
  const { preferences, updatePreferences } = usePlanPreferences();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Settings2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>View Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-2">
          <div className="mb-2 text-sm font-medium">View Type</div>
          <ToggleGroup
            type="single"
            value={preferences.view.viewType}
            onValueChange={(value) => {
              if (!value) return;
              updatePreferences({ view: { viewType: value as PlanViewType } });
            }}
            className="grid grid-cols-2 gap-2"
          >
            <ToggleGroupItem value="timeline" aria-label="Timeline view" className="flex-1">
              <LayoutList className="h-4 w-4 mr-2" />
              Timeline
            </ToggleGroupItem>
            <ToggleGroupItem value="calendar" aria-label="Calendar view" className="flex-1">
              <CalendarDays className="h-4 w-4 mr-2" />
              Calendar
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
