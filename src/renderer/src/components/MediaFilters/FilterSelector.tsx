import { Filter } from "lucide-react";
import { useTagDimensions } from "../../hooks/api/tags/useTagDimensions";
import { useChannels } from "../../hooks/api/useChannels";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

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

type FilterSelectorProps = {
  availableFilters: FilterConfig[];
  excludeTagDimensions?: string[];
  onFilterAdd: (filterKey: FilterType | string) => void;
  onChannelEligibilitySelect?: (channelId: string) => void;
  className?: string;
  noEligibleIn?: boolean;
};

export const FilterSelector = ({
  availableFilters,
  excludeTagDimensions = [],
  onFilterAdd,
  onChannelEligibilitySelect,
  className,
  noEligibleIn = false,
}: FilterSelectorProps) => {
  const { data: dimensions = [], isLoading: isLoadingDimensions } = useTagDimensions();
  const { data: channels = [], isLoading: isLoadingChannels } = useChannels();

  const filteredAvailableFilters = noEligibleIn
    ? availableFilters.filter((filter) => filter.key !== "eligibleChannelId")
    : availableFilters;

  const availableTagDimensions = dimensions.filter(
    (dimension) => !excludeTagDimensions.includes(dimension.name)
  );

  const channelsWithEligibleFilters = channels.filter((channel) => channel.eligibleMediaFilter);

  const hasAvailableFilters = filteredAvailableFilters.length > 0;
  const hasAvailableTagDimensions = availableTagDimensions.length > 0;
  const hasEligibleChannelFilter =
    !noEligibleIn && availableFilters.some((filter) => filter.key === "eligibleChannelId");

  if (isLoadingDimensions || isLoadingChannels) {
    return (
      <Button variant="outline" size="sm" className={`h-9 ${className}`} disabled>
        Loading...
      </Button>
    );
  }

  if (!hasAvailableFilters && !hasAvailableTagDimensions && !hasEligibleChannelFilter) {
    return null;
  }

  const regularFilters = filteredAvailableFilters.filter(
    (filter) => filter.key !== "eligibleChannelId"
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={`h-9 ${className}`}>
          <Filter className="mr-2 h-4 w-4" />
          Add filter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {regularFilters.length > 0 && (
          <>
            <DropdownMenuLabel>General Filters</DropdownMenuLabel>
            {regularFilters.map((filter) => (
              <DropdownMenuItem key={filter.key} onClick={() => onFilterAdd(filter.key)}>
                {filter.label}
              </DropdownMenuItem>
            ))}
          </>
        )}

        {hasEligibleChannelFilter && (
          <>
            {regularFilters.length > 0 && <DropdownMenuSeparator />}
            <DropdownMenuLabel>Channel Filters</DropdownMenuLabel>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Eligible in Channel</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {channelsWithEligibleFilters.length === 0 ? (
                  <DropdownMenuItem disabled>
                    No channels with eligible media filters
                  </DropdownMenuItem>
                ) : (
                  channelsWithEligibleFilters.map((channel) => (
                    <DropdownMenuItem
                      key={channel.id}
                      onClick={() => onChannelEligibilitySelect?.(channel.id)}
                    >
                      {channel.name}
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </>
        )}

        {(regularFilters.length > 0 || hasEligibleChannelFilter) && hasAvailableTagDimensions && (
          <DropdownMenuSeparator />
        )}

        {hasAvailableTagDimensions && (
          <>
            <DropdownMenuLabel>Tag Filters</DropdownMenuLabel>
            {availableTagDimensions.map((dimension) => (
              <DropdownMenuItem key={dimension.id} onClick={() => onFilterAdd(dimension.name)}>
                {dimension.name}
                {dimension.description && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({dimension.description})
                  </span>
                )}
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
