import { X } from "lucide-react";
import { type FC } from "react";
import { type DateRange } from "react-day-picker";
import { Button } from "./ui/button";
import { DateRangePicker } from "./ui/date-range-picker";

type ShootsFilterProps = {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  onClear: () => void;
  className?: string;
};

export const ShootsFilter: FC<ShootsFilterProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClear,
  className,
}) => {
  const hasFilters = startDate || endDate;

  const dateRange: DateRange | undefined =
    startDate || endDate
      ? {
          from: startDate,
          to: endDate,
        }
      : undefined;

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (!range) {
      onStartDateChange(undefined);
      onEndDateChange(undefined);
      return;
    }

    // Update both dates at once to prevent unnecessary refetches
    if (range.from && range.to) {
      onStartDateChange(range.from);
      onEndDateChange(range.to);
    } else {
      onStartDateChange(range.from);
      onEndDateChange(undefined);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className || ""}`}>
      <DateRangePicker
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        placeholder="Filter by shoot date"
      />
      {hasFilters && (
        <Button variant="ghost" size="icon" onClick={onClear} className="h-9 w-9">
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
