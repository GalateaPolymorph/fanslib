import { FanslyAnalyticsResponse } from "../../lib/fansly-analytics/fansly-analytics-response";
import { prefixNamespaceObject } from "../../lib/namespace";
import { getAnalyticsSummary } from "./analytics-summary";
import { AnalyticsHandlers, namespace } from "./api-type";
import { bulkFetchAnalytics } from "./bulk-fetch";
import { fetchFanslyAnalyticsData } from "./fetch-fansly-data";
import {
  addDatapointsToPost,
  cleanupExpiredAnalyticsFetchHistory,
  initializeAnalyticsAggregates,
} from "./operations";
import { getFanslyPostsWithAnalytics } from "./posts-analytics";
import { updateFanslyCredentialsFromFetch } from "./update-credentials";

export const handlers: AnalyticsHandlers = {
  addDatapointsToPost: (_, postId: string, datapoints: FanslyAnalyticsResponse) => {
    return addDatapointsToPost(postId, datapoints);
  },
  initializeAnalyticsAggregates: (_) => {
    return initializeAnalyticsAggregates();
  },
  getFanslyPostsWithAnalytics: async (_, sortBy = "date", sortDirection = "desc") => {
    return getFanslyPostsWithAnalytics(sortBy, sortDirection);
  },
  getAnalyticsSummary: async (_, params) => {
    if (!params) {
      // Default to last 30 days if no parameters provided
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 30);

      return getAnalyticsSummary(startDate, endDate);
    }

    // Convert date strings to Date objects
    const startDate = new Date(params.startDate);
    const endDate = new Date(params.endDate);

    return getAnalyticsSummary(startDate, endDate);
  },
  fetchFanslyAnalyticsData: async (
    _,
    postId: string,
    analyticsStartDate?: string,
    analyticsEndDate?: string
  ) => {
    const startDate = analyticsStartDate ? new Date(analyticsStartDate) : undefined;
    const endDate = analyticsEndDate ? new Date(analyticsEndDate) : undefined;
    return fetchFanslyAnalyticsData(postId, startDate, endDate);
  },
  bulkFetchAnalytics: async (_, params) => {
    // Convert analytics timeframe params to the format expected by bulkFetchAnalytics
    const bulkParams = params
      ? {
          startDate: params.analyticsStartDate,
          endDate: params.analyticsEndDate,
        }
      : undefined;
    return bulkFetchAnalytics(bulkParams);
  },
  updateFanslyCredentialsFromFetch: async (_, fetchRequest: string) => {
    return updateFanslyCredentialsFromFetch(fetchRequest);
  },
  onBulkFetchProgress: (_) => {
    // Stub for event listener
  },
  onBulkFetchComplete: (_) => {
    // Stub for event listener
  },
  cleanupExpiredAnalyticsFetchHistory: async (_) => {
    return cleanupExpiredAnalyticsFetchHistory();
  },
};

export const analyticsHandlers = prefixNamespaceObject(namespace, handlers);
