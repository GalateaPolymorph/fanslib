import { FanslyAnalyticsResponse } from "../../../lib/fansly-analytics/fansly-analytics-response";
import { addDatapointsToPost } from "../operations";
import { bulkFetchAnalytics } from "./bulk-fetch";
import { fetchFanslyAnalyticsData } from "./fetch-fansly-data";
import { getFanslyPostsWithAnalytics, getHashtagAnalytics, getTimeAnalytics } from "./operations";
import { BulkFetchParams, PostAnalyticsHandlers } from "./api-type";

export const postAnalyticsHandlers: PostAnalyticsHandlers = {
  addDatapointsToPost: (_: unknown, postId: string, datapoints: FanslyAnalyticsResponse) => {
    return addDatapointsToPost(postId, datapoints);
  },
  getFanslyPostsWithAnalytics: async (_: unknown, sortBy = "date", sortDirection: "asc" | "desc" = "desc") => {
    return getFanslyPostsWithAnalytics(sortBy, sortDirection);
  },
  getHashtagAnalytics: async (_: unknown) => {
    return getHashtagAnalytics();
  },
  getTimeAnalytics: async (_: unknown) => {
    return getTimeAnalytics();
  },
  fetchFanslyAnalyticsData: async (
    _: unknown,
    postId: string,
    analyticsStartDate?: string,
    analyticsEndDate?: string
  ) => {
    const startDate = analyticsStartDate ? new Date(analyticsStartDate) : undefined;
    const endDate = analyticsEndDate ? new Date(analyticsEndDate) : undefined;
    return fetchFanslyAnalyticsData(postId, startDate, endDate);
  },
  bulkFetchAnalytics: async (_: unknown, params?: BulkFetchParams) => {
    // Convert analytics timeframe params to the format expected by bulkFetchAnalytics
    const bulkParams = params
      ? {
          startDate: params.analyticsStartDate,
          endDate: params.analyticsEndDate,
        }
      : undefined;
    return bulkFetchAnalytics(bulkParams);
  },
  onBulkFetchProgress: (_: unknown) => {
    // Stub for event listener
  },
  onBulkFetchComplete: (_: unknown) => {
    // Stub for event listener
  },
};