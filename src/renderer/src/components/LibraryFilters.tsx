import { useEffect, useState } from "react";
import { Category } from "../../../lib/database/categories/type";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";

interface LibraryFiltersProps {
  onFilterChange: (filters: { isNew?: boolean; categories?: string[] }) => void;
}

export const LibraryFilters = ({ onFilterChange }: LibraryFiltersProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showNewOnly, setShowNewOnly] = useState(false);

  useEffect(() => {
    window.api.category.getAllCategories().then(setCategories);
  }, []);

  const handleCategoryToggle = (slug: string) => {
    setSelectedCategories((prev) => {
      const newSelection = prev.includes(slug) ? prev.filter((id) => id !== slug) : [...prev, slug];

      onFilterChange({
        isNew: showNewOnly || undefined,
        categories: newSelection.length > 0 ? newSelection : undefined,
      });

      return newSelection;
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
    setSelectedCategories([]);
    setShowNewOnly(false);
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

      {categories.length > 0 && (
        <>
          <Separator orientation="vertical" className="h-6" />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                Categories
                {selectedCategories.length > 0 && (
                  <Badge variant="secondary" className="ml-2 rounded-sm px-1 font-normal">
                    {selectedCategories.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56" align="start">
              <div className="space-y-2">
                {categories.map((category) => (
                  <div
                    key={category.slug}
                    className="flex items-center gap-2"
                    style={{ color: category.color }}
                  >
                    <Switch
                      checked={selectedCategories.includes(category.slug)}
                      onCheckedChange={() => handleCategoryToggle(category.slug)}
                      id={`category-${category.slug}`}
                    />
                    <label htmlFor={`category-${category.slug}`} className="text-sm cursor-pointer">
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </>
      )}

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
          Clear Filters
        </Button>
      )}
    </div>
  );
};
