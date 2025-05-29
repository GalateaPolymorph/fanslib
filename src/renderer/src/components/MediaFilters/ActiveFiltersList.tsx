import { X } from "lucide-react";
import type {
  MediaFilters as MediaFiltersType,
  TagFilter as TagFilterType,
} from "../../../../features/library/api-type";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

type FilterType =
  | "search"
  | "caption"
  | "channelFilters"
  | "subredditFilters"
  | "shoots"
  | "excludeShoots"
  | "tagFilters"
  | "eligibleChannelId";

type FilterConfig = {
  label: string;
  key: FilterType;
};

type ActiveFiltersListProps = {
  activeFilters: FilterConfig[];
  activeTagFilters: string[];
  value: MediaFiltersType;
  onRemoveFilter: (key: FilterType) => void;
  onRemoveTagFilter: (dimensionName: string) => void;
  renderFilterContent: (key: FilterType) => React.ReactNode;
  renderTagFilter: (dimensionName: string, filter: TagFilterType) => React.ReactNode;
  vertical?: boolean;
};

export const ActiveFiltersList = ({
  activeFilters,
  activeTagFilters,
  value,
  onRemoveFilter,
  onRemoveTagFilter,
  renderFilterContent,
  renderTagFilter,
  vertical = false,
}: ActiveFiltersListProps) => (
  <div
    className={cn("flex flex-1 gap-x-4 gap-y-2", !vertical && "flex-row", vertical && "flex-col")}
  >
    {activeFilters.map((filter) => (
      <div key={filter.key} className={cn("flex shrink-0 items-center gap-2 group")}>
        {renderFilterContent(filter.key)}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={() => onRemoveFilter(filter.key)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    ))}

    {activeTagFilters.map((dimensionName) => (
      <div key={dimensionName}>
        {renderTagFilter(dimensionName, value.tagFilters![dimensionName])}
      </div>
    ))}
  </div>
);
