import { FilterPresetProvider } from "../../contexts/FilterPresetContext";
import { FilterPresetManager } from "../../components/MediaFilters/FilterPresetManager";
import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Filter, Settings as SettingsIcon } from "lucide-react";

export const FilterPresetSettings = () => {
  const [showManager, setShowManager] = useState(false);

  // Empty filter update handler since we're just managing presets
  const handleFiltersChange = () => {};

  return (
    <FilterPresetProvider onFiltersChange={handleFiltersChange}>
      <div className="space-y-6">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold">
            <Filter /> Filter Presets
          </h1>
          <p className="text-muted-foreground">
            Manage your saved filter presets for quick media filtering
          </p>
        </div>

        <div className="space-y-4">
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
      </div>
    </FilterPresetProvider>
  );
};
