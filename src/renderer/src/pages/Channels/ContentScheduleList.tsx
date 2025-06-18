import { MediaFilterSummary } from "@renderer/components/MediaFilterSummary";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@renderer/components/ui/alert-dialog";
import { Button } from "@renderer/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { ContentSchedule, parseMediaFilters } from "../../../../features/content-schedules/entity";

type ContentScheduleListProps = {
  schedules: ContentSchedule[];
  onEdit: (schedule: ContentSchedule) => void;
  onDelete: (schedule: ContentSchedule) => void;
};

export const ContentScheduleList = ({ schedules, onEdit, onDelete }: ContentScheduleListProps) => {
  const formatDays = (schedule: ContentSchedule) => {
    return schedule.type !== "daily" && schedule.preferredDays?.length
      ? `on ${schedule.preferredDays
          .map((d) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d])
          .join(", ")}`
      : "";
  };

  if (!schedules.length) {
    return (
      <div className="text-sm text-muted-foreground">No content schedules configured yet.</div>
    );
  }

  return (
    <div className="flex flex-col gap-2 divide-y">
      {schedules.map((schedule) => {
        return (
          <div key={schedule.id} className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm">
                    {schedule.postsPerTimeframe} post
                    {schedule.postsPerTimeframe > 1 && "s"} per{" "}
                    {schedule.type === "daily"
                      ? "day"
                      : schedule.type === "weekly"
                        ? "week"
                        : "month"}
                  </p>
                </div>
                {formatDays(schedule) && (
                  <p className="text-xs text-muted-foreground">{formatDays(schedule)}</p>
                )}
                <MediaFilterSummary
                  mediaFilters={parseMediaFilters(schedule.mediaFilters)}
                  compact={false}
                  layout="inline"
                />
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" onClick={() => onEdit(schedule)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Schedule</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this content schedule? This action cannot be
                        undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(schedule)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
