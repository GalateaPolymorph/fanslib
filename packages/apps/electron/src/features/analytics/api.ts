import { prefixNamespaceObject } from "../../lib/namespace";
import { AnalyticsHandlers, namespace } from "./api-type";
import { credentialsHandlers } from "./credentials/api";
import { insightsHandlers } from "./insights/api";
import { initializeAnalyticsAggregates } from "./operations";
import { postAnalyticsHandlers } from "./post-analytics/api";
import { summariesHandlers } from "./summaries/api";
import { tagAnalyticsHandlers } from "./tag-analytics/api";

export const handlers: AnalyticsHandlers = {
  initializeAnalyticsAggregates: (_: unknown) => {
    return initializeAnalyticsAggregates();
  },

  ...credentialsHandlers,
  ...insightsHandlers,
  ...postAnalyticsHandlers,
  ...summariesHandlers,
  ...tagAnalyticsHandlers,
};

export const analyticsHandlers = prefixNamespaceObject(namespace, handlers);
