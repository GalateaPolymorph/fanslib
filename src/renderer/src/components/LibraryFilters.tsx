import { CategorySelect } from "./CategorySelect";
import { SearchInput } from "./SearchInput";
import { ShootSelect } from "./ShootSelect";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

interface LibraryFiltersProps {
  value: {
    categories?: string[];
    unposted?: boolean;
    search?: string;
    excludeShoots?: string[];
  };
  onFilterChange: (filters: {
    categories?: string[] | undefined;
    unposted?: boolean;
    search?: string;
    excludeShoots?: string[];
  }) => void;
}

export function LibraryFilters({ value, onFilterChange }: LibraryFiltersProps) {
  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <CategorySelect
            value={value.categories}
            onChange={(categories) => {
              onFilterChange({
                ...value,
                categories,
              });
            }}
            multiple={true}
            includeNoneOption
          />

          <div className="flex items-center gap-2">
            <Switch
              id="unposted"
              checked={value.unposted ?? false}
              onCheckedChange={(checked) => {
                onFilterChange({
                  ...value,
                  unposted: checked,
                });
              }}
            />
            <Label htmlFor="unposted">Unposted</Label>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <SearchInput
            value={value.search ?? ""}
            onChange={(search) => {
              onFilterChange({
                ...value,
                search: search || undefined,
              });
            }}
            placeholder="Search media paths..."
          />

          <ShootSelect
            value={value.excludeShoots}
            onChange={(excludeShoots) => {
              onFilterChange({
                ...value,
                excludeShoots,
              });
            }}
            multiple={true}
          />
        </div>
      </div>

      {(value.categories || value.unposted || value.search || value.excludeShoots) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            onFilterChange({
              categories: undefined,
              unposted: undefined,
              search: undefined,
              excludeShoots: undefined,
            })
          }
          className="text-muted-foreground"
        >
          Clear filters
        </Button>
      )}
    </div>
  );
}
