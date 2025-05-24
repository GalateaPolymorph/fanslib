import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { AnalyticsFetchDialog } from "./AnalyticsFetchDialog";

type BulkFetchButtonProps = {
  isFetching: boolean;
  onStartFetch: (
    fetchRequest: string,
    analyticsTimeframe: { startDate: Date; endDate: Date }
  ) => Promise<void>;
};

export const BulkFetchButton = ({ isFetching, onStartFetch }: BulkFetchButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => {
    if (!isFetching) {
      setIsDialogOpen(true);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const confirmFetch = async (
    fetchRequest: string,
    analyticsTimeframe: { startDate: Date; endDate: Date }
  ) => {
    await onStartFetch(fetchRequest, analyticsTimeframe);
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={openDialog}
        disabled={isFetching}
        className="flex items-center gap-2"
      >
        <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
        {isFetching ? "Fetching..." : "Bulk Fetch Analytics"}
      </Button>

      <AnalyticsFetchDialog isOpen={isDialogOpen} onClose={closeDialog} onConfirm={confirmFetch} />
    </>
  );
};
