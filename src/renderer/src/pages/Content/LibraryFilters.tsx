import { useState } from "react";
import { CategorySelect } from "../../components/CategorySelect";
import { Button } from "../../components/ui/button";

interface LibraryFiltersProps {
  onFilterChange: (filters: { categories?: string[] }) => void;
}

export const LibraryFilters = ({ onFilterChange }: LibraryFiltersProps) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCategoryChange = (slugs: string[]) => {
    setSelectedCategories(slugs);
    onFilterChange({
      categories: slugs.length > 0 ? slugs : undefined,
    });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    onFilterChange({});
  };

  const hasActiveFilters = selectedCategories.length > 0;

  return (
    <div className="flex items-center gap-2 py-2 min-h-14">
      <CategorySelect value={selectedCategories} onChange={handleCategoryChange} multiple={true} />

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
          Clear Filters
        </Button>
      )}
    </div>
  );
};
