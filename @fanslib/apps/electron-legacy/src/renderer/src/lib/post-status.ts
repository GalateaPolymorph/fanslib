import { PostStatus } from "../../../features/posts/entity";

export const STATUS_COLORS = {
  draft: "#94a3b8",
  scheduled: "#3b82f6",
  posted: "#22c55e",
} as const;

export const STATUS_LABELS: Record<PostStatus, string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  posted: "Posted",
} as const;
