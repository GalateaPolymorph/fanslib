import { FanslyAnalyticsResponse } from "../../lib/fansly-analytics/fansly-analytics-response";
import { prefixNamespace, PrefixNamespace, StripNamespace } from "../../lib/namespace";
import { Post } from "../posts/entity";
import { BulkFetchProgress, BulkFetchResult } from "./bulk-fetch";
import { FanslyAnalyticsDatapoint } from "./entity";

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

export type AnalyticsSummaryParams = {
  startDate: string;
  endDate: string;
};

export type BulkFetchParams = {
  analyticsStartDate: string;
  analyticsEndDate: string;
};

export type FanslyCredentials = {
  fanslyAuth?: string;
  fanslySessionId?: string;
  fanslyClientCheck?: string;
  fanslyClientId?: string;
};

export type AnalyticsSummary = {
  engagementTrend: number; // percentage change
  averageEngagementPercent: number; // average percentage of videos watched
  totalViews: number; // total views in the timeframe
  viewsTrend: number; // percentage change in views
  topPerformerIds: string[];
  topPerformers: {
    id: string;
    caption: string;
    views: number;
    engagement: number;
    post: Post;
  }[];
  topPerformersByViews: {
    id: string;
    caption: string;
    views: number;
    post: Post;
  }[];
};

const methods = [
  "addDatapointsToPost",
  "initializeAnalyticsAggregates",
  "getFanslyPostsWithAnalytics",
  "getAnalyticsSummary",
  "fetchFanslyAnalyticsData",
  "bulkFetchAnalytics",
  "updateFanslyCredentialsFromFetch",
  "onBulkFetchProgress",
  "onBulkFetchComplete",
  "cleanupExpiredAnalyticsFetchHistory",
] as const;

export type AnalyticsHandlers = {
  addDatapointsToPost: (
    _: unknown,
    postId: string,
    datapoints: FanslyAnalyticsResponse
  ) => Promise<FanslyAnalyticsDatapoint[]>;
  initializeAnalyticsAggregates: (_: unknown) => Promise<void>;
  getFanslyPostsWithAnalytics: (
    _: unknown,
    sortBy?: string,
    sortDirection?: "asc" | "desc"
  ) => Promise<FanslyPostWithAnalytics[]>;
  getAnalyticsSummary: (_: unknown, params?: AnalyticsSummaryParams) => Promise<AnalyticsSummary>;
  fetchFanslyAnalyticsData: (
    _: unknown,
    postId: string,
    analyticsStartDate?: string,
    analyticsEndDate?: string
  ) => Promise<FanslyAnalyticsResponse>;
  bulkFetchAnalytics: (_: unknown, params?: BulkFetchParams) => Promise<BulkFetchResult>;
  updateFanslyCredentialsFromFetch: (_: unknown, fetchRequest: string) => Promise<void>;
  onBulkFetchProgress: (
    _: unknown,
    listener: (_: unknown, progress: BulkFetchProgress) => void
  ) => void;
  onBulkFetchComplete: (
    _: unknown,
    listener: (_: unknown, result: BulkFetchResult) => void
  ) => void;
  cleanupExpiredAnalyticsFetchHistory: (_: unknown) => Promise<number>;
};

export const namespace = "analytics" as const;
export const analyticsMethods = methods.map((m) => prefixNamespace(namespace, m));
export type AnalyticsIpcChannel = keyof PrefixNamespace<AnalyticsHandlers, typeof namespace>;
export type AnalyticsIpcHandlers = {
  [K in AnalyticsIpcChannel]: AnalyticsHandlers[StripNamespace<K, typeof namespace>];
};
