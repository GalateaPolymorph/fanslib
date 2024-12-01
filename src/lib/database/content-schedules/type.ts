export type ContentSchedule = {
  id: string;
  channelId: string;
  categorySlug: string;
  type: "daily" | "weekly" | "monthly";
  postsPerTimeframe?: number;
  // 0-6, Sunday-Saturday
  preferredDays?: number[];
  // List of preferred posting times in 24-hour format "HH:mm"
  preferredTimes?: string[];
  lastSynced?: string; // ISO date string of last successful sync
  updatedAt: string; // ISO string
  createdAt: string; // ISO string
};
