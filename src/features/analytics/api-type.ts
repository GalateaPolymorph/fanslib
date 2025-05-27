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

// Tag Analytics Types
export type TagAnalyticsParams = {
  tagIds?: number[];
  dimensionIds?: number[];
  timeRange?: { start: Date; end: Date };
  metrics?: string[];
};

export type TagPerformanceMetrics = {
  tagId: number;
  tagName: string;
  dimensionName: string;
  totalAssignments: number;
  averageEngagement: number;
  topPerformingMedia: string[];
  trendDirection: "up" | "down" | "stable";
  confidenceScore: number;
};

export type TagCorrelationData = {
  tagId1: number;
  tagId2: number;
  correlationStrength: number;
  combinedPerformance: number;
  coOccurrenceCount: number;
};

export type ActionableInsight = {
  type: "videoLength" | "hashtag" | "contentTheme" | "postTiming";
  confidence: number; // 0-1 scale based on statistical significance
  recommendation: string; // Human-readable recommendation
  supportingData: {
    // Common fields
    sampleSize: number;
    timeRange: string; // e.g., "Last 30 days"
    // Type-specific fields
    [key: string]: any; // Additional data to render the insight
  };
};

export type VideoLengthInsight = ActionableInsight & {
  supportingData: {
    sampleSize: number;
    timeRange: string;
    optimalRange: [number, number]; // seconds
    performanceByRange: {
      range: string;
      avgViews: number;
      avgEngagement: number;
      sampleSize: number;
    }[];
  };
};

export type HashtagInsight = ActionableInsight & {
  supportingData: {
    sampleSize: number;
    timeRange: string;
    hashtag: string;
    performanceBoost: number; // percentage
    usageCount: number;
    comparisonData: {
      withHashtag: { avgViews: number; avgEngagement: number };
      withoutHashtag: { avgViews: number; avgEngagement: number };
    };
  };
};

export type ContentThemeInsight = ActionableInsight & {
  supportingData: {
    sampleSize: number;
    timeRange: string;
    theme: string;
    keywords: string[];
    performanceBoost: number; // percentage
    postCount: number;
    avgViews: number;
    avgEngagement: number;
  };
};

export type PostTimingInsight = ActionableInsight & {
  supportingData: {
    sampleSize: number;
    timeRange: string;
    optimalTimeSlot: string;
    performanceBoost: number; // percentage
    postCount: number;
    avgViews: number;
    avgEngagement: number;
    timeSlotData: {
      timeSlot: string;
      avgViews: number;
      avgEngagement: number;
      postCount: number;
    }[];
  };
};

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
