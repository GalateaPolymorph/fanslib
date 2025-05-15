import { useChannels } from "@renderer/contexts/ChannelContext";
import { Filter, Search, X } from "lucide-react";
import { omit } from "ramda";
import type { MediaFilters as MediaFiltersType } from "../../../features/library/api-type";
import { cn } from "../lib/utils";
import { CategorySelect } from "./CategorySelect";
import { ChannelPostFilter } from "./ChannelPostFilter";
import { ChannelSelect } from "./ChannelSelect";
import { ShootSelect } from "./ShootSelect";
import { SubredditPostFilter } from "./SubredditPostFilter";
import { TierSelect } from "./TierSelect";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";

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
  | "categories"
  | "tiers"
  | "channelFilters"
  | "subredditFilters"
  | "shoots"
  | "excludeShoots";

type FilterConfig = {
  label: string;
  key: FilterType;
};

const AVAILABLE_FILTERS: FilterConfig[] = [
  { label: "Search", key: "search" },
  { label: "Categories", key: "categories" },
  { label: "Tiers", key: "tiers" },
  { label: "Channel", key: "channelFilters" },
  { label: "Subreddit", key: "subredditFilters" },
  { label: "Shoot", key: "shoots" },
  { label: "Exclude Shoots", key: "excludeShoots" },
];

export const MediaFilters = ({
  value,
  onChange,
  showClearButton = true,
  className = "",
  vertical = false,
  noEligibleIn = false,
}: MediaFiltersProps) => {
  const { channels } = useChannels();
  const clearFilters = () => {
    onChange({
      categories: undefined,
      search: undefined,
      excludeShoots: undefined,
      shootId: undefined,
      channelFilters: undefined,
      subredditFilters: undefined,
      tiers: undefined,
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
    onChange({ ...value, [key]: undefined });
  };

  const isFilterActive = (key: FilterType): boolean => {
    if (key === "shoots") return value.shootId !== undefined;
    if (key === "search") return value.search !== undefined;
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

  const renderFilterContent = (key: FilterType) => {
    switch (key) {
      case "search":
        return (
          <div className="flex items-center gap-2 w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9 pr-8"
                value={value.search ?? ""}
                onChange={(e) => {
                  onChange({
                    ...value,
                    search: e.target.value,
                  });
                }}
                placeholder="Search media paths..."
              />
              {value.search && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onChange({ ...value, search: undefined })}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        );
      case "categories":
        return (
          <CategorySelect
            value={
              !value.categories
                ? []
                : value.categories.map((id) => ({ id, state: "selected" as const }))
            }
            onChange={(categories) => {
              onChange({
                ...value,
                categories:
                  categories === undefined
                    ? []
                    : categories.filter((c) => c.state === "selected").map((c) => c.id),
              });
            }}
            multiple={true}
            includeNoneOption
          />
        );
      case "tiers":
        return (
          <TierSelect
            includeNoneOption
            selectedTierIds={value.tiers ? value.tiers.map(Number) : undefined}
            onTierSelect={(tierIds) => {
              onChange({
                ...value,
                tiers: tierIds === undefined ? [] : tierIds,
              });
            }}
            multiple
          />
        );
      case "channelFilters":
        return (
          <ChannelPostFilter
            value={value.channelFilters ?? []}
            onChange={(channelFilters) => {
              onChange({
                ...omit(["channelFilters"], value),
                channelFilters,
              });
            }}
          />
        );
      case "subredditFilters":
        return (
          <SubredditPostFilter
            value={value.subredditFilters ?? []}
            onChange={(subredditFilters) => {
              onChange({
                ...omit(["subredditFilters"], value),
                subredditFilters,
              });
            }}
          />
        );
      case "shoots":
        return (
          <ShootSelect
            value={[value.shootId]}
            onChange={(shootIds) => {
              onChange({
                ...value,
                shootId: shootIds[0],
                excludeShoots: undefined,
              });
            }}
            multiple={false}
            omitAllShoots
            placeholder="Shoot"
          />
        );
      case "excludeShoots":
        return (
          <ShootSelect
            value={value.excludeShoots}
            onChange={(excludeShoots) => {
              onChange({
                ...value,
                shootId: undefined,
                excludeShoots,
              });
            }}
            multiple={true}
            placeholder="Exclude shoots"
          />
        );
    }
  };

  const hasFilters = getActiveFilters().length > 0;

  return (
    <div className={`flex flex-col gap-4 w-full ${className}`}>
      <div className={cn("flex flex-wrap gap-4", vertical && "flex flex-col")}>
        {!noEligibleIn && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                Eligible in channel
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[180px] p-4">
              <ChannelSelect
                selectable={false}
                value={[]}
                onChange={(channelIds) => {
                  if (channelIds.length > 0) {
                    applyChannelEligibilityFilter(channelIds[0]);
                  }
                }}
                className="flex-1"
                multiple={false}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="mr-2 h-4 w-4" />
              Add filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {getAvailableFilters().map((filter) => (
              <DropdownMenuItem
                key={filter.key}
                onClick={() => {
                  if (filter.key === "shoots") {
                    onChange({ ...value, shootId: "" });
                    return;
                  }
                  if (filter.key === "excludeShoots") {
                    onChange({ ...value, excludeShoots: [] });
                    return;
                  }
                  if (filter.key === "search") {
                    onChange({ ...value, search: "" });
                    return;
                  }
                  onChange({ ...value, [filter.key]: [] });
                }}
              >
                {filter.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div
          className={cn(
            "flex flex-1 gap-x-4 gap-y-2",
            !vertical && "flex-row",
            vertical && "flex-col"
          )}
        >
          {getActiveFilters().map((filter) => (
            <div key={filter.key} className={cn("flex shrink-0 items-center gap-2 group")}>
              {renderFilterContent(filter.key)}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => removeFilter(filter.key)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {showClearButton && hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground"
          >
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
};
