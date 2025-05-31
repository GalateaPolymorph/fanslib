import { MediaFilters as MediaFiltersType } from "../../../../features/library/api-type";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { FilterGroupEditor } from "./FilterGroupEditor";

type MediaFiltersProps = {
  value: MediaFiltersType;
  onChange: (filters: MediaFiltersType) => void;
  showClearButton?: boolean;
  className?: string;
};

export const MediaFilters = ({
  value,
  onChange,
  showClearButton = true,
  className = "",
}: MediaFiltersProps) => {
  const clearFilters = () => {
    onChange([]);
  };

  const hasActiveFilters =
    value && value.length > 0 && value.some((group) => group.items.length > 0);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        {showClearButton && hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear All Filters
          </Button>
        )}
      </div>

      <FilterGroupEditor value={value || []} onChange={onChange} className="w-full" />
    </div>
  );
};
