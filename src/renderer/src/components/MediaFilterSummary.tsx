import { cn } from "@renderer/lib/utils";
import { Camera, Filter, Search, Users } from "lucide-react";
import { MediaFilters } from "../../../features/library/api-type";
import { FilterSummaryItem, useMediaFilterSummary } from "../hooks/business/useMediaFilterSummary";

type MediaFilterSummaryProps = {
  mediaFilters: MediaFilters | null;
  className?: string;
  compact?: boolean;
  layout?: "inline" | "stacked" | "grouped";
};

const getFilterIcon = (type: FilterSummaryItem["type"]) => {
  switch (type) {
    case "search":
      return <Search className="h-3 w-3" />;
    case "channel":
      return <Users className="h-3 w-3" />;
    case "shoot":
    case "excludeShoot":
      return <Camera className="h-3 w-3" />;
    case "tag":
      return <Filter className="h-3 w-3" />;
    default:
      return <Filter className="h-3 w-3" />;
  }
};

const FilterItem = ({ item, compact }: { item: FilterSummaryItem; compact?: boolean }) => {
  const renderContent = () => {
    if (item.type === "tag") {
      if (item.isNoneFilter) {
        return `No ${item.label}`;
      }

      if (item.tags?.length) {
        // Show individual tag names if we have them and there aren't too many
        if (item.tags.length <= 2 && !compact) {
          return item.tags.map((tag) => tag.displayName).join(", ");
        } else {
          // Show count for many tags or in compact mode
          return compact
            ? `${item.count} ${item.label.toLowerCase()}`
            : `${item.count} ${item.label.toLowerCase()} tag${item.count !== 1 ? "s" : ""}`;
        }
      } else {
        // Fallback when tags are loading
        return compact
          ? `${item.count} ${item.label.toLowerCase()}`
          : `${item.count} ${item.label.toLowerCase()} tag${item.count !== 1 ? "s" : ""}`;
      }
    }

    if (item.type === "search") {
      return compact ? `"${item.value}"` : `Search: "${item.value}"`;
    }

    if (item.type === "channel") {
      return compact
        ? `${item.count} channels`
        : `${item.count} channel${item.count !== 1 ? "s" : ""}`;
    }

    if (item.type === "excludeShoot") {
      return compact
        ? `Exclude ${item.count}`
        : `Exclude ${item.count} shoot${item.count !== 1 ? "s" : ""}`;
    }

    return item.label;
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5",
        compact ? "text-sm" : "text-sm",
        "text-muted-foreground"
      )}
    >
      {!compact && getFilterIcon(item.type)}
      <span>{renderContent()}</span>
    </span>
  );
};

const FilterGroup = ({
  title,
  items,
  compact,
}: {
  title: string;
  items: FilterSummaryItem[];
  compact?: boolean;
}) => {
  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5">
      {!compact && (
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          {title}
        </span>
      )}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {items.map((item, index) => (
          <FilterItem key={`${item.type}-${item.label}-${index}`} item={item} compact={compact} />
        ))}
      </div>
    </div>
  );
};

export const MediaFilterSummary = ({
  mediaFilters,
  className,
  compact = false,
  layout = "inline",
}: MediaFilterSummaryProps) => {
  const filterItems = useMediaFilterSummary(mediaFilters);

  if (filterItems.length === 0) {
    return null;
  }

  // Group filters by type for structured layouts
  const groupedFilters = {
    tags: filterItems.filter((item) => item.type === "tag"),
    content: filterItems.filter((item) => ["search", "shoot", "excludeShoot"].includes(item.type)),
    channels: filterItems.filter((item) => item.type === "channel"),
  };

  if (layout === "inline") {
    return (
      <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-1.5", className)}>
        {!compact && <span className="text-sm text-muted-foreground mr-1">Filters:</span>}
        {filterItems.map((item, index) => (
          <FilterItem key={`${item.type}-${item.label}-${index}`} item={item} compact={compact} />
        ))}
      </div>
    );
  }

  if (layout === "stacked") {
    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
          {filterItems.map((item, index) => (
            <FilterItem key={`${item.type}-${item.label}-${index}`} item={item} compact={compact} />
          ))}
        </div>
      </div>
    );
  }

  if (layout === "grouped") {
    return (
      <div className={cn("flex flex-col gap-2.5", className)}>
        <FilterGroup title="Tags" items={groupedFilters.tags} compact={compact} />
        <FilterGroup title="Content" items={groupedFilters.content} compact={compact} />
        <FilterGroup title="Channels" items={groupedFilters.channels} compact={compact} />
      </div>
    );
  }

  return null;
};
