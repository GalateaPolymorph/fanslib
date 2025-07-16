import { FanslyAnalyticsResponse } from "../../../lib/fansly-analytics/fansly-analytics-response";
import { prefixNamespace, PrefixNamespace, StripNamespace } from "../../../lib/namespace";
import { BulkFetchProgress, BulkFetchResult } from "../bulk-fetch";
import { FanslyAnalyticsDatapoint } from "../entity";
import { ActionableInsight } from "./insights";
import {
  BulkFetchParams,
  FanslyPostWithAnalytics,
  HashtagAnalytics,
  TimeAnalytics,
} from "./post-analytics";
import { AnalyticsSummary, AnalyticsSummaryParams } from "./summary-analytics";
import { TagAnalyticsParams, TagCorrelationData, TagPerformanceMetrics } from "./tag-analytics";

const methods = [
  "addDatapointsToPost",
  "initializeAnalyticsAggregates",
  "getFanslyPostsWithAnalytics",
  "getAnalyticsSummary",
  "getHashtagAnalytics",
  "getTimeAnalytics",
  "generateInsights",
  "fetchFanslyAnalyticsData",
  "bulkFetchAnalytics",
  "updateFanslyCredentialsFromFetch",
  "onBulkFetchProgress",
  "onBulkFetchComplete",

  // Tag Analytics
  "getTagAnalytics",
  "getTagPerformanceMetrics",
  "getTagCorrelations",
  "getTagTrends",
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
  getHashtagAnalytics: (_: unknown) => Promise<HashtagAnalytics>;
  getTimeAnalytics: (_: unknown) => Promise<TimeAnalytics>;
  generateInsights: (_: unknown) => Promise<ActionableInsight[]>;
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

  // Tag Analytics
  getTagAnalytics: (_: unknown, params: TagAnalyticsParams) => Promise<TagPerformanceMetrics[]>;
  getTagPerformanceMetrics: (
    _: unknown,
    tagIds: number[],
    timeRange: { start: Date; end: Date }
  ) => Promise<TagPerformanceMetrics[]>;
  getTagCorrelations: (_: unknown, dimensionId?: number) => Promise<TagCorrelationData[]>;
  getTagTrends: (
    _: unknown,
    tagIds: number[],
    timeRange: { start: Date; end: Date }
  ) => Promise<any>;
};

export const namespace = "analytics" as const;
export const analyticsMethods = methods.map((m) => prefixNamespace(namespace, m));
export type AnalyticsIpcChannel = keyof PrefixNamespace<AnalyticsHandlers, typeof namespace>;
export type AnalyticsIpcHandlers = {
  [K in AnalyticsIpcChannel]: AnalyticsHandlers[StripNamespace<K, typeof namespace>];
};
