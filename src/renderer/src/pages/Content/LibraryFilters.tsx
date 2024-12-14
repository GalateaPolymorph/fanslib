import { CategorySelect } from "../../components/CategorySelect";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";

interface LibraryFiltersProps {
  value: {
    categories?: string[];
    unposted?: boolean;
  };
  onFilterChange: (filters: { categories?: string[] | undefined; unposted?: boolean }) => void;
}

export function LibraryFilters({ value, onFilterChange }: LibraryFiltersProps) {
  return (
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

      {(value.categories || value.unposted) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            onFilterChange({
              categories: undefined,
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
