import { Badge } from "@renderer/components/ui/badge";
import { PostStatus } from "../../../features/posts/entity";
import { STATUS_COLORS, STATUS_LABELS } from "../lib/post-status";

type StatusBadgeProps = {
  status: PostStatus;
  className?: string;
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => (
  <Badge
    className={className}
    style={{
      backgroundColor: STATUS_COLORS[status],
      borderColor: STATUS_COLORS[status],
      color: "white",
    }}
  >
    {STATUS_LABELS[status]}
  </Badge>
);
