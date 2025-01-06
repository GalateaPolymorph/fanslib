import { omit } from "ramda";
import type { ChannelPostFilter as ChannelPostFilterType } from "../../../features/library/api-type";
import { CategorySelect } from "./CategorySelect";
import { ChannelPostFilter } from "./ChannelPostFilter";
import { SearchInput } from "./SearchInput";
import { ShootSelect } from "./ShootSelect";
import { Button } from "./ui/button";

interface LibraryFiltersProps {
  value: {
    categories?: string[];
    search?: string;
    excludeShoots?: string[];
    channelFilters?: ChannelPostFilterType[];
  };
  onFilterChange: (filters: {
    categories?: string[] | undefined;
    search?: string;
    excludeShoots?: string[];
    channelFilters?: ChannelPostFilterType[];
  }) => void;
}

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

        {(value.categories || value.search || value.excludeShoots || value.channelFilters) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              onFilterChange({
                categories: undefined,
                search: undefined,
                excludeShoots: undefined,
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
