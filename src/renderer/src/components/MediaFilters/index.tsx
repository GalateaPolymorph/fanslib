import { useChannels } from "@renderer/hooks/api/useChannels";
import { omit } from "ramda";
import type {
  MediaFilters as MediaFiltersType,
  TagFilter as TagFilterType,
} from "../../../../features/library/api-type";
import { cn } from "../../lib/utils";
import { ChannelPostFilter } from "../ChannelPostFilter";
import { ShootSelect } from "../ShootSelect";
import { SubredditPostFilter } from "../SubredditPostFilter";
import { Button } from "../ui/button";
import { ActiveFiltersList } from "./ActiveFiltersList";
import { CaptionFilterContent } from "./FilterContent/CaptionFilterContent";
import { EligibleChannelFilterContent } from "./FilterContent/EligibleChannelFilterContent";
import { SearchFilterContent } from "./FilterContent/SearchFilterContent";
import { TagFilterContent } from "./FilterContent/TagFilterContent";
import { FilterSelector } from "./FilterSelector";

type MediaFiltersProps = {
  value: MediaFiltersType;
  onChange: (filters: MediaFiltersType) => void;
  showClearButton?: boolean;
  vertical?: boolean;
  className?: string;
  noEligibleIn?: boolean;
};

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

const AVAILABLE_FILTERS: FilterConfig[] = [
  { label: "Search", key: "search" },
  { label: "Caption", key: "caption" },
  { label: "Channel", key: "channelFilters" },
  { label: "Subreddit", key: "subredditFilters" },
  { label: "Shoot", key: "shoots" },
  { label: "Exclude Shoots", key: "excludeShoots" },
  { label: "Eligible in Channel", key: "eligibleChannelId" },
];

export const MediaFilters = ({
  value,
  onChange,
  showClearButton = true,
  className = "",
  vertical = false,
  noEligibleIn = false,
}: MediaFiltersProps) => {
  const { data: channels = [], isLoading } = useChannels();

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading filters...</div>;
  }

  const clearFilters = () => {
    onChange({
      search: undefined,
      caption: undefined,
      excludeShoots: undefined,
      shootId: undefined,
      channelFilters: undefined,
      subredditFilters: undefined,
      tagFilters: undefined,
      eligibleChannelId: undefined,
    });
  };

  const removeFilter = (key: FilterType) => {
    if (key === "shoots") {
      onChange({ ...value, shootId: undefined });
      return;
    }
    if (key === "excludeShoots") {
      onChange({ ...value, excludeShoots: undefined });
      return;
    }
    if (key === "eligibleChannelId") {
      onChange({ ...value, eligibleChannelId: undefined });
      return;
    }
    onChange({ ...value, [key]: undefined });
  };

  const isFilterActive = (key: FilterType): boolean => {
    if (key === "shoots") return value.shootId !== undefined;
    if (key === "search") return value.search !== undefined;
    if (key === "caption") return value.caption !== undefined;
    if (key === "tagFilters") return value.tagFilters && Object.keys(value.tagFilters).length > 0;
    if (key === "eligibleChannelId") return value.eligibleChannelId !== undefined;
    return !!value[key];
  };

  const getActiveFilters = () => AVAILABLE_FILTERS.filter((filter) => isFilterActive(filter.key));
  const getAvailableFilters = () =>
    AVAILABLE_FILTERS.filter((filter) => !isFilterActive(filter.key));

  const applyChannelEligibilityFilter = (channelId: string) => {
    const channel = channels.find((c) => c.id === channelId);
    if (!channel?.eligibleMediaFilter) return;
    onChange(channel.eligibleMediaFilter);
  };

  const addTagFilter = (dimensionName: string) => {
    const newTagFilters = {
      ...value.tagFilters,
      [dimensionName]: { tagIds: [], operator: "OR" as const },
    };
    onChange({ ...value, tagFilters: newTagFilters });
  };

  const updateTagFilter = (dimensionName: string, filter: TagFilterType) => {
    const newTagFilters = {
      ...value.tagFilters,
      [dimensionName]: filter,
    };
    onChange({ ...value, tagFilters: newTagFilters });
  };

  const removeTagFilter = (dimensionName: string) => {
    const newTagFilters = { ...value.tagFilters };
    delete newTagFilters[dimensionName];

    const hasRemainingFilters = Object.keys(newTagFilters).length > 0;
    onChange({
      ...value,
      tagFilters: hasRemainingFilters ? newTagFilters : undefined,
    });
  };

  const getActiveTagFilters = () => {
    return value.tagFilters ? Object.keys(value.tagFilters) : [];
  };

  const handleFilterAdd = (filterKey: string) => {
    const generalFilter = AVAILABLE_FILTERS.find((f) => f.key === filterKey);

    if (generalFilter) {
      switch (generalFilter.key) {
        case "shoots":
          onChange({ ...value, shootId: "" });
          break;
        case "excludeShoots":
          onChange({ ...value, excludeShoots: [] });
          break;
        case "search":
          onChange({ ...value, search: "" });
          break;
        case "caption":
          onChange({ ...value, caption: "" });
          break;
        case "eligibleChannelId":
          onChange({ ...value, eligibleChannelId: "" });
          break;
        default:
          onChange({ ...value, [generalFilter.key]: [] });
      }
    } else {
      addTagFilter(filterKey);
    }
  };

  const renderFilterContent = (key: FilterType) => {
    switch (key) {
      case "search":
        return (
          <SearchFilterContent
            value={value.search}
            onChange={(search) => onChange({ ...value, search })}
          />
        );
      case "caption":
        return (
          <CaptionFilterContent
            value={value.caption}
            onChange={(caption) => onChange({ ...value, caption })}
          />
        );
      case "channelFilters":
        return (
          <ChannelPostFilter
            value={value.channelFilters ?? []}
            onChange={(channelFilters) =>
              onChange({ ...omit(["channelFilters"], value), channelFilters })
            }
          />
        );
      case "subredditFilters":
        return (
          <SubredditPostFilter
            value={value.subredditFilters ?? []}
            onChange={(subredditFilters) =>
              onChange({ ...omit(["subredditFilters"], value), subredditFilters })
            }
          />
        );
      case "shoots":
        return (
          <ShootSelect
            value={[value.shootId]}
            onChange={(shootIds) =>
              onChange({ ...value, shootId: shootIds[0], excludeShoots: undefined })
            }
            multiple={false}
            omitAllShoots
            placeholder="Shoot"
          />
        );
      case "excludeShoots":
        return (
          <ShootSelect
            value={value.excludeShoots}
            onChange={(excludeShoots) => onChange({ ...value, shootId: undefined, excludeShoots })}
            multiple={true}
            placeholder="Exclude shoots"
          />
        );
      case "eligibleChannelId":
        return (
          <EligibleChannelFilterContent
            value={value.eligibleChannelId}
            onChange={(channelId) => {
              if (channelId) {
                applyChannelEligibilityFilter(channelId);
              } else {
                onChange({ ...value, eligibleChannelId: undefined });
              }
            }}
          />
        );
      default:
        return null;
    }
  };

  const renderTagFilter = (dimensionName: string, filter: TagFilterType) => (
    <TagFilterContent
      dimensionName={dimensionName}
      filter={filter}
      onUpdate={updateTagFilter}
      onRemove={removeTagFilter}
    />
  );

  const hasFilters = getActiveFilters().length > 0 || getActiveTagFilters().length > 0;

  return (
    <div className={`flex flex-col gap-4 w-full ${className}`}>
      <div className={cn("flex flex-wrap gap-4", vertical && "flex flex-col")}>
        <FilterSelector
          availableFilters={getAvailableFilters()}
          excludeTagDimensions={getActiveTagFilters()}
          onFilterAdd={handleFilterAdd}
          onChannelEligibilitySelect={applyChannelEligibilityFilter}
          noEligibleIn={noEligibleIn}
        />

        <ActiveFiltersList
          activeFilters={getActiveFilters()}
          activeTagFilters={getActiveTagFilters()}
          value={value}
          onRemoveFilter={removeFilter}
          onRemoveTagFilter={removeTagFilter}
          renderFilterContent={renderFilterContent}
          renderTagFilter={renderTagFilter}
          vertical={vertical}
        />

        {showClearButton && hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-9 text-muted-foreground"
          >
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
};
