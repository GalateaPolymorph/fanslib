import { useQuery } from "@tanstack/react-query";
import {
  TagAnalyticsParams,
  TagCorrelationData,
  TagPerformanceMetrics,
} from "../../../../features/analytics/api-type";

export const tagAnalyticsQueryKeys = {
  tagAnalytics: (params: TagAnalyticsParams) => ["tag-analytics", params],
  tagPerformanceMetrics: (tagIds: number[], timeRange: { start: Date; end: Date }) => [
    "tag-performance-metrics",
    tagIds,
    timeRange,
  ],
  tagCorrelations: (dimensionId?: number) => ["tag-correlations", dimensionId],
  tagTrends: (tagIds: number[], timeRange: { start: Date; end: Date }) => [
    "tag-trends",
    tagIds,
    timeRange,
  ],
};

export const useTagAnalytics = (params: TagAnalyticsParams) => {
  return useQuery<TagPerformanceMetrics[]>({
    queryKey: tagAnalyticsQueryKeys.tagAnalytics(params),
    queryFn: async () => {
      return window.api["analytics:getTagAnalytics"](params);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useTagPerformanceMetrics = (
  tagIds: number[],
  timeRange: { start: Date; end: Date }
) => {
  return useQuery<TagPerformanceMetrics[]>({
    queryKey: tagAnalyticsQueryKeys.tagPerformanceMetrics(tagIds, timeRange),
    queryFn: async () => {
      return window.api["analytics:getTagPerformanceMetrics"](tagIds, timeRange);
    },
    enabled: tagIds.length > 0,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useTagCorrelations = (dimensionId?: number) => {
  return useQuery<TagCorrelationData[]>({
    queryKey: tagAnalyticsQueryKeys.tagCorrelations(dimensionId),
    queryFn: async () => {
      return window.api["analytics:getTagCorrelations"](dimensionId);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

export const useTagTrends = (tagIds: number[], timeRange: { start: Date; end: Date }) => {
  return useQuery({
    queryKey: tagAnalyticsQueryKeys.tagTrends(tagIds, timeRange),
    queryFn: async () => {
      return window.api["analytics:getTagTrends"](tagIds, timeRange);
    },
    enabled: tagIds.length > 0,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
