import { getTagAnalytics, getTagCorrelations, getTagTrends } from "./operations";
import { TagAnalyticsParams, TagAnalyticsHandlers } from "./api-type";

export const tagAnalyticsHandlers: TagAnalyticsHandlers = {
  // Tag Analytics
  getTagAnalytics: async (_: unknown, params: TagAnalyticsParams) => {
    return getTagAnalytics(params);
  },
  getTagPerformanceMetrics: async (
    _: unknown,
    tagIds: number[],
    timeRange: { start: Date; end: Date }
  ) => {
    return getTagAnalytics({ tagIds, timeRange });
  },
  getTagCorrelations: async (_: unknown, dimensionId?: number) => {
    return getTagCorrelations(dimensionId);
  },
  getTagTrends: async (_: unknown, tagIds: number[], timeRange: { start: Date; end: Date }) => {
    return getTagTrends(tagIds, timeRange);
  },
};
