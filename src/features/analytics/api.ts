import { FanslyAnalyticsResponse } from "../../lib/fansly-analytics/fansly-analytics-response";
import { prefixNamespaceObject } from "../../lib/namespace";
import { AnalyticsHandlers, namespace } from "./api-type";
import { addDatapointsToPost } from "./operations";

export const handlers: AnalyticsHandlers = {
  addDatapointsToPost: (_, postId: string, datapoints: FanslyAnalyticsResponse) => {
    return addDatapointsToPost(postId, datapoints);
  },
};

export const analyticsHandlers = prefixNamespaceObject(namespace, handlers);
