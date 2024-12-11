import { useState } from "react";
import { CategorySelect } from "../../components/CategorySelect";
import { Button } from "../../components/ui/button";
import { Switch } from "../../components/ui/switch";
import { Label } from "../../components/ui/label";

interface LibraryFiltersProps {
  onFilterChange: (filters: { categories?: string[]; unposted?: boolean }) => void;
}

export const LibraryFilters = ({ onFilterChange }: LibraryFiltersProps) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showUnposted, setShowUnposted] = useState(false);

  const handleCategoryChange = (slugs: string[]) => {
    setSelectedCategories(slugs);
    onFilterChange({
      categories: slugs.length > 0 ? slugs : undefined,
      unposted: showUnposted,
    });
  };

  const handleUnpostedChange = (checked: boolean) => {
    setShowUnposted(checked);
    onFilterChange({
      categories: selectedCategories.length > 0 ? selectedCategories : undefined,
      unposted: checked,
    });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setShowUnposted(false);
    onFilterChange({});
  };

  const hasActiveFilters = selectedCategories.length > 0 || showUnposted;

  return (
    <div className="flex items-center gap-4 py-2 min-h-14">
      <CategorySelect value={selectedCategories} onChange={handleCategoryChange} multiple={true} />

      <div className="flex items-center gap-2">
        <Switch
          id="unposted"
          checked={showUnposted}
          onCheckedChange={handleUnpostedChange}
        />
        <Label htmlFor="unposted">Show unposted only</Label>
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
          Clear Filters
        </Button>
      )}
    </div>
  );
};
