import { FanslyAnalyticsResponse } from "../../lib/fansly-analytics/fansly-analytics-response";
import { prefixNamespaceObject } from "../../lib/namespace";
import { getAnalyticsSummary } from "./analytics-summary";
import { AnalyticsHandlers, namespace } from "./api-type";
import { fetchFanslyAnalyticsData } from "./fetch-fansly-data";
import { addDatapointsToPost, initializeAnalyticsAggregates } from "./operations";
import { getFanslyPostsWithAnalytics } from "./posts-analytics";

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
  fetchFanslyAnalyticsData: async (_, postId: string) => {
    return fetchFanslyAnalyticsData(postId);
  },
};
export const analyticsHandlers = prefixNamespaceObject(namespace, handlers);
