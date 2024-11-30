import { useState } from "react";
import { CategorySelect } from "./CategorySelect";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";

interface LibraryFiltersProps {
  onFilterChange: (filters: { isNew?: boolean; categories?: string[] }) => void;
}

export const LibraryFilters = ({ onFilterChange }: LibraryFiltersProps) => {
  const [showNewOnly, setShowNewOnly] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCategoryChange = (slugs: string[]) => {
    setSelectedCategories(slugs);
    onFilterChange({
      isNew: showNewOnly || undefined,
      categories: slugs.length > 0 ? slugs : undefined,
    });
  };

  const handleNewToggle = (checked: boolean) => {
    setShowNewOnly(checked);
    onFilterChange({
      isNew: checked || undefined,
      categories: selectedCategories.length > 0 ? selectedCategories : undefined,
    });
  };

  const clearFilters = () => {
    setShowNewOnly(false);
    setSelectedCategories([]);
    onFilterChange({});
  };

  const hasActiveFilters = showNewOnly || selectedCategories.length > 0;

  return (
    <div className="flex items-center gap-2 py-2 min-h-14">
      <div className="flex items-center gap-2">
        <Switch checked={showNewOnly} onCheckedChange={handleNewToggle} id="new-filter" />
        <label htmlFor="new-filter" className="text-sm">
          New Items Only
        </label>
      </div>

      <Separator orientation="vertical" className="h-6" />

      <CategorySelect value={selectedCategories} onChange={handleCategoryChange} multiple={true} />

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
          Clear Filters
        </Button>
      )}
    </div>
  );
};
