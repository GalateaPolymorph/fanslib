import { Badge } from "@renderer/components/ui/badge";
import { PostStatus } from "../../../features/posts/entity";
import { STATUS_COLORS, STATUS_LABELS } from "../lib/post-status";
import { cn } from "../lib/utils";

const STATUS_OPTIONS = [
  { id: "draft" as const, label: STATUS_LABELS.draft, color: STATUS_COLORS.draft },
  { id: "scheduled" as const, label: STATUS_LABELS.scheduled, color: STATUS_COLORS.scheduled },
  { id: "posted" as const, label: STATUS_LABELS.posted, color: STATUS_COLORS.posted },
] as const;

type StatusSelectProps = {
  value: PostStatus[];
  onChange: (status: PostStatus[]) => void;
  multiple?: boolean;
  includeNoneOption?: boolean;
};

export const StatusSelect = ({
  value,
  onChange,
  multiple = false,
  includeNoneOption = false,
}: StatusSelectProps) => {
  const values = value ? (Array.isArray(value) ? value : [value]) : [];

  const toggleStatus = (status: PostStatus) => {
    if (multiple) {
      const newValues = values.includes(status)
        ? values.filter((v) => v !== status)
        : [...values, status];
      onChange(newValues.length === 0 && includeNoneOption ? [] : newValues);
      return;
    }

    if (values.length === 0) {
      onChange([status]);
      return;
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {STATUS_OPTIONS.map((status) => {
        const isSelected = values.includes(status.id);

        return (
          <Badge
            key={status.id}
            variant={isSelected ? "default" : "outline"}
            className={cn(
              "transition-colors cursor-pointer",
              !multiple && values.length > 0 && !isSelected && "opacity-50"
            )}
            style={{
              backgroundColor: isSelected ? status.color : "transparent",
              borderColor: status.color,
              color: isSelected ? "white" : status.color,
            }}
            onClick={() => toggleStatus(status.id)}
          >
            {status.label}
          </Badge>
        );
      })}
      {includeNoneOption && (
        <Badge
          variant={values.length === 0 ? "default" : "outline"}
          className={cn(
            "transition-colors cursor-pointer text-muted-foreground",
            !multiple && values.length > 0 && "opacity-50"
          )}
          onClick={() => onChange(multiple ? [] : [])}
          style={{
            backgroundColor: values.length === 0 ? "hsl(var(--muted))" : "transparent",
            borderColor: "hsl(var(--muted))",
          }}
        >
          None
        </Badge>
      )}
    </div>
  );
};
