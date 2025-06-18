import { cn } from "@renderer/lib/utils";
import { Calendar, Camera, FileText, Filter, Hash, MapPin, Minus, Plus } from "lucide-react";
import { MediaFilters } from "../../../features/library/api-type";
import { FilterSummaryItem, useMediaFilterSummary } from "../hooks/business/useMediaFilterSummary";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

type MediaFilterSummaryProps = {
  mediaFilters: MediaFilters | null;
  className?: string;
  compact?: boolean;
  layout?: "inline" | "stacked" | "grouped";
};

const getFilterIcon = (type: FilterSummaryItem["type"], size = "h-3 w-3") => {
  switch (type) {
    case "location":
      return <MapPin className={size} />;
    case "content":
      return <FileText className={size} />;
    case "media":
      return <Camera className={size} />;
    case "date":
      return <Calendar className={size} />;
    case "tags":
      return <Hash className={size} />;
    default:
      return <Filter className={size} />;
  }
};

const getIncludeIcon = (include: boolean) => {
  return include ? <Plus className="h-2.5 w-2.5" /> : <Minus className="h-2.5 w-2.5" />;
};

const FilterBadge = ({ item, compact }: { item: FilterSummaryItem; compact?: boolean }) => {
  const displayLabel = compact
    ? `${item.count}${item.count > 1 ? "" : ""}`
    : item.details && item.details.length > 0
      ? item.details.length === 1
        ? item.details[0]
        : `${item.details.slice(0, 2).join(", ")}${item.details.length > 2 ? ` +${item.details.length - 2}` : ""}`
      : item.count > 1
        ? `${item.label} (${item.count})`
        : item.label;

  const badge = (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border text-xs font-medium transition-colors cursor-default",
        item.include
          ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
          : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
        compact ? "px-1.5 py-0.5" : "px-2 py-1"
      )}
    >
      <span className="flex items-center gap-0.5">
        {getIncludeIcon(item.include)}
        {getFilterIcon(item.type, "h-2.5 w-2.5")}
      </span>
      <span>{displayLabel}</span>
    </span>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <p>{item.tooltip}</p>
          {item.details && item.details.length > 1 && (
            <div className="mt-1 text-xs opacity-80">
              {item.details.slice(0, 5).join(", ")}
              {item.details.length > 5 && ` and ${item.details.length - 5} more`}
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const FilterSummary = ({ items, compact }: { items: FilterSummaryItem[]; compact?: boolean }) => {
  if (items.length === 0) {
    return null;
  }

  // Show up to 3 items in compact mode, with a "+more" indicator
  const visibleItems = compact ? items.slice(0, 3) : items;
  const remainingCount = compact ? Math.max(0, items.length - 3) : 0;

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {visibleItems.map((item, index) => (
        <FilterBadge key={`${item.type}-${item.label}-${index}`} item={item} compact={compact} />
      ))}

      {remainingCount > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">
                +{remainingCount}
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <p>
                {items
                  .slice(3)
                  .map((item) => item.label)
                  .join(", ")}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
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
  console.log(filterItems);

  if (filterItems.length === 0) {
    return null;
  }

  // Group by include/exclude for better organization
  const includeItems = filterItems.filter((item) => item.include);
  const excludeItems = filterItems.filter((item) => !item.include);

  // For grouped layout, show include and exclude sections separately
  if (layout === "grouped" && !compact) {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        {includeItems.length > 0 && (
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground font-medium">Include</span>
            <FilterSummary items={includeItems} compact={compact} />
          </div>
        )}
        {excludeItems.length > 0 && (
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground font-medium">Exclude</span>
            <FilterSummary items={excludeItems} compact={compact} />
          </div>
        )}
      </div>
    );
  }

  // For inline/stacked layouts, show all items together
  return (
    <div className={cn("flex items-center", className)}>
      <FilterSummary items={filterItems} compact={compact} />
    </div>
  );
};
