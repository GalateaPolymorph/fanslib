import { TierBadge } from "@renderer/components/TierBadge";
import { useTiers } from "@renderer/hooks/useTiers";
import { Edit, Trash2 } from "lucide-react";
import { ContentSchedule } from "../../../../features/content-schedules/entity";
import { CategoryBadge } from "../../components/CategoryBadge";
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
} from "../../components/ui/alert-dialog";
import { Button } from "../../components/ui/button";
import { useCategories } from "../../contexts/CategoryContext";

type ContentScheduleListProps = {
  schedules: ContentSchedule[];
  onEdit: (schedule: ContentSchedule) => void;
  onDelete: (schedule: ContentSchedule) => void;
};

export const ContentScheduleList = ({ schedules, onEdit, onDelete }: ContentScheduleListProps) => {
  const { categories } = useCategories();
  const { tiers } = useTiers();

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
        const category = categories.find((c) => c.id === schedule.categoryId);
        const tier = tiers.find((t) => t.id === schedule.tierId);
        return (
          <div key={schedule.id} className="pb-3">
            <div className="flex items-center justify-between">
              <p className="text-sm">
                {schedule.postsPerTimeframe} {tier && <TierBadge tier={tier} />}{" "}
                {category && <CategoryBadge category={category} />} post
                {schedule.postsPerTimeframe > 1 && "s"} per{" "}
                {schedule.type === "daily" ? "day" : schedule.type === "weekly" ? "week" : "month"}
              </p>
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
            {formatDays(schedule) && (
              <p className="text-xs text-muted-foreground">{formatDays(schedule)}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};
