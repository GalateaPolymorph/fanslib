export type FanslyPostWithAnalytics = {
  id: string;
  date: string;
  caption: string;
  thumbnailUrl: string;
  totalViews: number;
  averageEngagementSeconds: number;
  averageEngagementPercent: number;
  hashtags: string[];
  videoLength: number;
};

export type BulkFetchParams = {
  analyticsStartDate: string;
  analyticsEndDate: string;
};

export type HashtagAnalytics = {
  hashtag: string;
  postCount: number;
  avgViews: number;
  avgEngagement: number;
}[];

export type TimeAnalytics = {
  timePeriod: string; // e.g., "Monday 12-2pm"
  postCount: number;
  avgViews: number;
  avgEngagement: number;
}[];