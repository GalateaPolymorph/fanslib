import { cn } from "@renderer/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { type DateRange } from "react-day-picker";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

type DateRangePickerProps = {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  placeholder?: string;
  className?: string;
};

export const DateRangePicker = ({
  dateRange,
  onDateRangeChange,
  placeholder,
  className,
}: DateRangePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (range: DateRange | undefined) => {
    // If we have a range with both dates the same, only set the from date
    if (range?.from && range?.to && range.from === range.to) {
      onDateRangeChange({ from: range.from, to: undefined });
      return;
    }

    onDateRangeChange(range);
    // Only close the popover when both dates are selected and they're different
    if (range?.from && range?.to && range.from !== range.to) {
      setIsOpen(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    // Only allow closing if we have a complete range or explicitly closing via escape/click outside
    if (!open && (!dateRange?.from || (dateRange.from && dateRange.to))) {
      setIsOpen(false);
    } else if (open) {
      setIsOpen(true);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[300px] justify-start text-left font-normal",
            !dateRange && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateRange?.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
              </>
            ) : (
              format(dateRange.from, "LLL dd, y")
            )
          ) : (
            <span>{placeholder ?? "Pick a date range"}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div onMouseDown={(e) => e.preventDefault()}>
          <Calendar
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={handleSelect}
            numberOfMonths={1}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};
