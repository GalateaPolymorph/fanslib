import { useQuery } from "@tanstack/react-query";
import {
  TagAnalyticsParams,
  TagCorrelationData,
  TagPerformanceMetrics,
} from "../../../../features/analytics/api-type";

export const useTagAnalytics = (params: TagAnalyticsParams) => {
  return useQuery<TagPerformanceMetrics[]>({
    queryKey: ["tag-analytics", params],
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
    queryKey: ["tag-performance-metrics", tagIds, timeRange],
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
    queryKey: ["tag-correlations", dimensionId],
    queryFn: async () => {
      return window.api["analytics:getTagCorrelations"](dimensionId);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

export const useTagTrends = (tagIds: number[], timeRange: { start: Date; end: Date }) => {
  return useQuery({
    queryKey: ["tag-trends", tagIds, timeRange],
    queryFn: async () => {
      return window.api["analytics:getTagTrends"](tagIds, timeRange);
    },
    enabled: tagIds.length > 0,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
