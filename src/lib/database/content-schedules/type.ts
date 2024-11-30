export type ContentSchedule = {
  id: string;
  channelId: string;
  categorySlug: string;
  type: "daily" | "weekly" | "monthly";
  postsPerTimeframe?: number;
  // 0-6, Sunday-Saturday
  preferredDays?: number[];
};
