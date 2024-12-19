import { CategorySelect } from "./CategorySelect";
import { SearchInput } from "./SearchInput";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

interface LibraryFiltersProps {
  value: {
    categories?: string[];
    unposted?: boolean;
    search?: string;
  };
  onFilterChange: (filters: {
    categories?: string[] | undefined;
    unposted?: boolean;
    search?: string;
  }) => void;
}

export function LibraryFilters({ value, onFilterChange }: LibraryFiltersProps) {
  return (
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

      {(value.categories || value.unposted || value.search) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            onFilterChange({
              categories: undefined,
              unposted: undefined,
              search: undefined,
            })
          }
          className="text-muted-foreground"
        >
          Clear Filters
        </Button>
      )}
    </div>
  );
}
