import { endOfMonth, format, startOfMonth, subDays, subMonths } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { useMemo } from "react";
import { useAnalytics } from "../../contexts/AnalyticsContext";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export const TimeframeSelector = () => {
  const { timeframe, setTimeframe } = useAnalytics();

  // Generate the last 3 months as options
  const monthOptions = useMemo(() => {
    const today = new Date();
    const result = [];

    // Add last 3 months
    for (let i = 1; i <= 3; i++) {
      const monthDate = subMonths(today, i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);

      result.push({
        label: format(monthDate, "MMMM yyyy"),
        startDate: monthStart,
        endDate: monthEnd,
      });
    }

    return result;
  }, []);

  // Set to last 30 days
  const setLastThirtyDays = () => {
    const today = new Date();
    setTimeframe({
      startDate: subDays(today, 30),
      endDate: today,
    });
  };

  // Set to specific month
  const setMonth = (startDate: Date, endDate: Date) => {
    setTimeframe({
      startDate,
      endDate,
    });
  };

  // Format the current timeframe for display
  const getDisplayText = () => {
    // Check if it's the last 30 days
    const today = new Date();
    const thirtyDaysAgo = subDays(today, 30);

    // The date comparison needs to account for time differences
    const isWithinOneDay = (d1: Date, d2: Date) =>
      Math.abs(d1.getTime() - d2.getTime()) < 24 * 60 * 60 * 1000;

    if (
      isWithinOneDay(timeframe.endDate, today) &&
      isWithinOneDay(timeframe.startDate, thirtyDaysAgo)
    ) {
      return "Last 30 days";
    }

    // Check if it's one of our month options
    for (const option of monthOptions) {
      if (
        isWithinOneDay(timeframe.startDate, option.startDate) &&
        isWithinOneDay(timeframe.endDate, option.endDate)
      ) {
        return option.label;
      }
    }

    // Custom date range
    return `${format(timeframe.startDate, "MMM d, yyyy")} - ${format(timeframe.endDate, "MMM d, yyyy")}`;
  };

  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="min-w-36 justify-between">
            <span>{getDisplayText()}</span>
            <ChevronDownIcon className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={setLastThirtyDays}>Last 30 days</DropdownMenuItem>

          {/* Month options */}
          {monthOptions.map((option) => (
            <DropdownMenuItem
              key={option.label}
              onClick={() => setMonth(option.startDate, option.endDate)}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
