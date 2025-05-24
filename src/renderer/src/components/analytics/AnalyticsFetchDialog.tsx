import { endOfMonth, format, startOfMonth, subDays, subMonths } from "date-fns";
import { ChevronDownIcon, InfoIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";

type TimeframeOption = {
  label: string;
  startDate: Date;
  endDate: Date;
};

type AnalyticsFetchDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    fetchRequest: string,
    analyticsTimeframe: { startDate: Date; endDate: Date }
  ) => Promise<void>;
};

export const AnalyticsFetchDialog = ({ isOpen, onClose, onConfirm }: AnalyticsFetchDialogProps) => {
  const [fetchRequest, setFetchRequest] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Initialize analytics timeframe to last 30 days
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState<{ startDate: Date; endDate: Date }>(
    () => {
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      return {
        startDate: thirtyDaysAgo,
        endDate: today,
      };
    }
  );

  // Generate the last 3 months as options
  const monthOptions = useMemo(() => {
    const today = new Date();
    const result: TimeframeOption[] = [];

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
    setAnalyticsTimeframe({
      startDate: subDays(today, 30),
      endDate: today,
    });
  };

  // Set to specific month
  const setMonth = (startDate: Date, endDate: Date) => {
    setAnalyticsTimeframe({
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
      isWithinOneDay(analyticsTimeframe.endDate, today) &&
      isWithinOneDay(analyticsTimeframe.startDate, thirtyDaysAgo)
    ) {
      return "Last 30 days";
    }

    // Check if it's one of our month options
    for (const option of monthOptions) {
      if (
        isWithinOneDay(analyticsTimeframe.startDate, option.startDate) &&
        isWithinOneDay(analyticsTimeframe.endDate, option.endDate)
      ) {
        return option.label;
      }
    }

    // Custom date range
    return `${format(analyticsTimeframe.startDate, "MMM d, yyyy")} - ${format(analyticsTimeframe.endDate, "MMM d, yyyy")}`;
  };

  const submitFetchRequest = async () => {
    if (!fetchRequest.trim()) {
      toast({
        title: "Fetch request required",
        description: "Please paste a valid Fansly fetch request.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      await onConfirm(fetchRequest, analyticsTimeframe);
      setFetchRequest("");
      onClose();
    } catch (error) {
      toast({
        title: "Invalid fetch request",
        description: error instanceof Error ? error.message : "Could not parse fetch request",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bulk Fetch Analytics Data</DialogTitle>
          <DialogDescription>
            This will fetch analytics data for all posts currently displayed in the dashboard.
            Select the analytics data timeframe you want to fetch from Fansly for each post.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="timeframe-selector" className="text-sm font-medium">
              Analytics Data Timeframe
            </label>
            <p className="text-xs text-muted-foreground">
              Choose what period of analytics data to fetch from Fansly for each post
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span>{getDisplayText()}</span>
                  <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-full">
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

          <div className="relative w-full rounded-lg border p-4 bg-background text-foreground">
            <div className="flex">
              <InfoIcon className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <div className="font-medium mb-1">How to get the fetch request:</div>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Go to Fansly in Chrome and log in</li>
                  <li>Open Developer Tools (F12)</li>
                  <li>Go to the Network tab</li>
                  <li>Navigate to any statistics page or refresh it</li>
                  <li>Look for a request to &ldquo;statsnew&rdquo; or similar</li>
                  <li>Right-click the request → Copy → Copy as fetch</li>
                  <li>Paste it below</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="fetch-request" className="text-sm font-medium">
              Fetch Request
            </label>
            <Textarea
              id="fetch-request"
              placeholder="Paste the fetch request here..."
              value={fetchRequest}
              onChange={(e) => setFetchRequest(e.target.value)}
              className="min-h-[120px] font-mono text-xs"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={submitFetchRequest} disabled={!fetchRequest.trim() || isProcessing}>
            {isProcessing ? "Processing..." : "Start Bulk Fetch"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
