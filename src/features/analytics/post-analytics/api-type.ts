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

export type PostAnalyticsHandlers = {
  addDatapointsToPost: (
    _: unknown,
    postId: string,
    datapoints: any // FanslyAnalyticsResponse
  ) => Promise<any[]>; // FanslyAnalyticsDatapoint[]
  getFanslyPostsWithAnalytics: (
    _: unknown,
    sortBy?: string,
    sortDirection?: "asc" | "desc"
  ) => Promise<FanslyPostWithAnalytics[]>;
  getHashtagAnalytics: (_: unknown) => Promise<HashtagAnalytics>;
  getTimeAnalytics: (_: unknown) => Promise<TimeAnalytics>;
  fetchFanslyAnalyticsData: (
    _: unknown,
    postId: string,
    analyticsStartDate?: string,
    analyticsEndDate?: string
  ) => Promise<any>; // FanslyAnalyticsResponse
  bulkFetchAnalytics: (_: unknown, params?: BulkFetchParams) => Promise<any>; // BulkFetchResult
  onBulkFetchProgress: (
    _: unknown,
    listener: (_: unknown, progress: any) => void // BulkFetchProgress
  ) => void;
  onBulkFetchComplete: (
    _: unknown,
    listener: (_: unknown, result: any) => void // BulkFetchResult
  ) => void;
};