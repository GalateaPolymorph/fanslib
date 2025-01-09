import { FilterPreferences } from "@renderer/contexts/LibraryPreferencesContext";
import { omit } from "ramda";
import { CategorySelect } from "./CategorySelect";
import { ChannelPostFilter } from "./ChannelPostFilter";
import { SearchInput } from "./SearchInput";
import { ShootSelect } from "./ShootSelect";
import { Button } from "./ui/button";

type LibraryFiltersProps = {
  value: FilterPreferences;
  onFilterChange: (filters: FilterPreferences) => void;
};

export const LibraryFilters = ({ value, onFilterChange }: LibraryFiltersProps) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col gap-4">
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
          </div>

          <div className="flex items-center gap-4">
            <ChannelPostFilter
              value={value.channelFilters ?? []}
              onChange={(channelFilters) => {
                onFilterChange({
                  ...omit(["channelFilters"], value),
                  channelFilters,
                });
              }}
            />
            <ShootSelect
              value={[value.shootId]}
              onChange={(shootIds) => {
                onFilterChange({
                  ...value,
                  shootId: shootIds[0],
                  excludeShoots: [],
                });
              }}
              multiple={false}
              omitAllShoots
              placeholder="Shoot"
            />
            <ShootSelect
              value={value.excludeShoots}
              onChange={(excludeShoots) => {
                onFilterChange({
                  ...value,
                  shootId: undefined,
                  excludeShoots,
                });
              }}
              multiple={true}
              placeholder="Exclude shoots"
            />
          </div>
        </div>

        {(value.categories ||
          value.search ||
          value.excludeShoots ||
          value.shootId ||
          value.channelFilters) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              onFilterChange({
                categories: undefined,
                search: undefined,
                excludeShoots: undefined,
                shootId: undefined,
                channelFilters: undefined,
              })
            }
            className="text-muted-foreground"
          >
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
};
