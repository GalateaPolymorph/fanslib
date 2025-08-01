import { Grid2X2, Grid3X3, Settings2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/DropdownMenu";
import { ToggleGroup, ToggleGroupItem } from "../../../components/ui/ToggleGroup";
import { GridSize, useLibraryPreferences } from "../../../contexts/LibraryPreferencesContext";

export const GalleryViewSettings = () => {
  const { preferences, updatePreferences } = useLibraryPreferences();

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
          <div className="mb-2 text-sm font-medium">Grid Size</div>
          <ToggleGroup
            type="single"
            value={preferences.view.gridSize}
            onValueChange={(value) => {
              if (!value) return;
              updatePreferences({ view: { gridSize: value as GridSize } });
            }}
            className="grid grid-cols-2 gap-2"
          >
            <ToggleGroupItem value="small" aria-label="Small grid" className="flex-1">
              <Grid3X3 className="h-4 w-4 mr-2" />
              Small
            </ToggleGroupItem>
            <ToggleGroupItem value="large" aria-label="Large grid" className="flex-1">
              <Grid2X2 className="h-4 w-4 mr-2" />
              Large
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
