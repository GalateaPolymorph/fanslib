import { ShootsFilter } from "@renderer/components/ShootsFilter";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { cn } from "@renderer/lib/utils";
import { type FC } from "react";
import { useLibrary } from "../../contexts/LibraryContext";
import { useMediaDrag } from "../../contexts/MediaDragContext";
import { useShootContext } from "../../contexts/ShootContext";
import { ShootCreateDropZone } from "./ShootCreateDropZone";
import { ShootDetail } from "./ShootDetail";

type ShootsProps = {
  className?: string;
};

export const Shoots: FC<ShootsProps> = ({ className }) => {
  const { refetch: refetchLibrary } = useLibrary();
  const {
    shoots,
    isLoading,
    error,
    refetch,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    clearDateFilters,
  } = useShootContext();
  const { isDragging } = useMediaDrag();

  if (isLoading) {
    return (
      <div className={className}>
        <div className="p-4">Loading shoots...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <div className="p-4 text-destructive">Error loading shoots: {error.message}</div>
      </div>
    );
  }

  return (
    <div className={cn(className, "relative h-full")}>
      <div className="sticky top-0 z-10 bg-background p-6">
        <ShootsFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onClear={clearDateFilters}
        />
      </div>
      <ScrollArea className="h-full w-full">
        <div className="flex flex-col px-6 pt-4 gap-2 pb-48">
          {shoots.length === 0 ? (
            isDragging ? (
              <ShootCreateDropZone className="h-24" />
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Drag media here to create your first shoot
              </div>
            )
          ) : (
            <>
              {shoots.map((shoot) => (
                <ShootDetail
                  key={shoot.id}
                  shoot={shoot}
                  onUpdate={() => {
                    refetch();
                    refetchLibrary();
                  }}
                />
              ))}
              {isDragging && <ShootCreateDropZone className="h-24" />}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
