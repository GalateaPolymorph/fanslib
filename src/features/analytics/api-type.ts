import { prefixNamespace, PrefixNamespace, StripNamespace } from "../../lib/namespace";
import { CredentialsHandlers } from "./credentials/api-type";
import { InsightsHandlers } from "./insights/api-type";
import { PostAnalyticsHandlers } from "./post-analytics/api-type";
import { SummariesHandlers } from "./summaries/api-type";
import { TagAnalyticsHandlers } from "./tag-analytics/api-type";

// Re-export all types from subdomain api-type files
export * from "./credentials/api-type";
export * from "./insights/api-type";
export * from "./post-analytics/api-type";
export * from "./summaries/api-type";
export * from "./tag-analytics/api-type";

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
  initializeAnalyticsAggregates: (_: unknown) => Promise<void>;
} & CredentialsHandlers &
  InsightsHandlers &
  PostAnalyticsHandlers &
  SummariesHandlers &
  TagAnalyticsHandlers;

export const namespace = "analytics" as const;
export const analyticsMethods = methods.map((m) => prefixNamespace(namespace, m));
export type AnalyticsIpcChannel = keyof PrefixNamespace<AnalyticsHandlers, typeof namespace>;
export type AnalyticsIpcHandlers = {
  [K in AnalyticsIpcChannel]: AnalyticsHandlers[StripNamespace<K, typeof namespace>];
};
