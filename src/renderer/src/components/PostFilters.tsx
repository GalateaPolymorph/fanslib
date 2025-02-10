import {
  defaultPreferences,
  PlanFilterPreferences,
} from "@renderer/contexts/PlanPreferencesContext";
import { equals } from "ramda";
import { PostStatus } from "src/features/posts/entity";
import { ChannelSelect } from "./ChannelSelect";
import { SearchInput } from "./SearchInput";
import { StatusSelect } from "./StatusSelect";
import { Button } from "./ui/button";

type PostFiltersProps = {
  value: PlanFilterPreferences;
  onFilterChange: (filters: Partial<PlanFilterPreferences>) => void;
};

export const PostFilters = ({ value, onFilterChange }: PostFiltersProps) => {
  const hasActiveFilters = !equals(value, defaultPreferences.filter);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-8">
            <SearchInput
              value={value.search ?? ""}
              onChange={(search) => {
                onFilterChange({
                  search: search || undefined,
                });
              }}
              placeholder="Search posts..."
            />
            <StatusSelect
              value={value.statuses}
              multiple
              onChange={(statuses) => {
                console.log({
                  value,
                  statuses,
                });
                onFilterChange({
                  statuses: statuses ? (statuses as PostStatus[]) : undefined,
                });
              }}
            />
            <ChannelSelect
              value={value.channels}
              onChange={(channels) => {
                onFilterChange({
                  channels: channels.length > 0 ? channels : undefined,
                });
              }}
            />
          </div>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFilterChange(defaultPreferences.filter)}
            className="text-muted-foreground"
          >
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
};
