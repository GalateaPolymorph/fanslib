import { cn } from "@renderer/lib/utils";
import { Minus, Plus } from "lucide-react";
import { MediaFilters } from "../../../features/library/api-type";
import { FilterSummaryItem, useMediaFilterSummary } from "../hooks/business/useMediaFilterSummary";

type MediaFilterSummaryProps = {
  mediaFilters: MediaFilters | null;
  className?: string;
  compact?: boolean;
  layout?: "inline" | "stacked" | "grouped";
};

const getFilterIcon = (include: boolean) => {
  return include ? <Plus className="h-3 w-3" /> : <Minus className="h-3 w-3" />;
};

const FilterItem = ({ item, compact }: { item: FilterSummaryItem; compact?: boolean }) => {
  const renderContent = () => {
    if (compact) {
      return `${item.include ? "+" : "-"} ${item.itemCount} filter${item.itemCount !== 1 ? "s" : ""}`;
    }

    return item.description;
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5",
        "text-sm text-muted-foreground",
        item.include ? "text-green-600" : "text-red-600"
      )}
    >
      {getFilterIcon(item.include)}
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

  // Group filters by include/exclude for structured layouts
  const groupedFilters = {
    include: filterItems.filter((item) => item.include),
    exclude: filterItems.filter((item) => !item.include),
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
        <FilterGroup title="Include" items={groupedFilters.include} compact={compact} />
        <FilterGroup title="Exclude" items={groupedFilters.exclude} compact={compact} />
      </div>
    );
  }

  return null;
};
