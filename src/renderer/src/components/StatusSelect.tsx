import { Badge } from "@renderer/components/ui/badge";
import { PostStatus } from "../../../features/posts/entity";
import { cn } from "../lib/utils";
import { STATUS_COLORS, STATUS_LABELS } from "../lib/post-status";

const STATUS_OPTIONS = [
  { id: "draft" as const, label: STATUS_LABELS.draft, color: STATUS_COLORS.draft },
  { id: "scheduled" as const, label: STATUS_LABELS.scheduled, color: STATUS_COLORS.scheduled },
  { id: "posted" as const, label: STATUS_LABELS.posted, color: STATUS_COLORS.posted },
] as const;

type StatusSelectProps = {
  value: PostStatus;
  onChange: (status: PostStatus) => void;
};

export const StatusSelect = ({ value, onChange }: StatusSelectProps) => (
  <div className="flex flex-wrap gap-2">
    {STATUS_OPTIONS.map((status) => {
      const isSelected = value === status.id;

      return (
        <Badge
          key={status.id}
          variant={isSelected ? "default" : "outline"}
          className={cn("transition-colors cursor-pointer", !isSelected && "opacity-50")}
          style={{
            backgroundColor: isSelected ? status.color : "transparent",
            borderColor: status.color,
            color: isSelected ? "white" : status.color,
          }}
          onClick={() => onChange(status.id)}
        >
          {status.label}
        </Badge>
      );
    })}
  </div>
);
