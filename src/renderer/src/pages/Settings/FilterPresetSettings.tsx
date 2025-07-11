import { FilterPresetProvider } from "../../contexts/FilterPresetContext";
import { FilterPresetManager } from "../../components/MediaFilters/FilterPresetManager";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Settings as SettingsIcon } from "lucide-react";

export const FilterPresetSettings = () => {
  const [showManager, setShowManager] = useState(false);

  // Empty filter update handler since we're just managing presets
  const handleFiltersChange = () => {};

  return (
    <FilterPresetProvider onFiltersChange={handleFiltersChange}>
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium">Filter Presets</h3>
          <p className="text-sm text-muted-foreground">
            Manage your saved filter presets. Create, edit, and delete presets for quick filtering.
          </p>
        </div>
        <div>
          <Button
            variant="outline"
            onClick={() => setShowManager(true)}
            className="flex items-center gap-2"
          >
            <SettingsIcon className="h-4 w-4" />
            Manage Filter Presets
          </Button>
        </div>
        <FilterPresetManager open={showManager} onOpenChange={setShowManager} />
      </div>
    </FilterPresetProvider>
  );
};
