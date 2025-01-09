import { Search, X } from "lucide-react";
import { type FC } from "react";
import { type DateRange } from "react-day-picker";
import { useShootContext } from "../contexts/ShootContext";
import { Button } from "./ui/button";
import { DateRangePicker } from "./ui/date-range-picker";
import { Input } from "./ui/input";

type ShootsFilterProps = {
  className?: string;
};

export const ShootsFilter: FC<ShootsFilterProps> = ({ className }) => {
  const { filter, updateFilter, clearFilter } = useShootContext();
  const hasFilters = filter.startDate || filter.endDate || filter.name;

  const dateRange: DateRange | undefined =
    filter.startDate || filter.endDate
      ? {
          from: filter.startDate,
          to: filter.endDate,
        }
      : undefined;

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (!range) {
      updateFilter({ startDate: undefined, endDate: undefined });
      return;
    }

    // Update both dates at once to prevent unnecessary refetches
    updateFilter({
      startDate: range.from,
      endDate: range.to,
    });
  };

  return (
    <div className={`flex items-center gap-2 ${className || ""}`}>
      <div className="relative">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filter.name ?? ""}
          onChange={(e) => updateFilter({ name: e.target.value })}
          className="pl-8"
          placeholder="Filter by name"
        />
      </div>
      <DateRangePicker
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        placeholder="Filter by shoot date"
      />
      {hasFilters && (
        <Button variant="ghost" size="icon" onClick={clearFilter} className="h-9 w-9">
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
