import { FanslyAnalyticsResponse } from "../../lib/fansly-analytics/fansly-analytics-response";
import { prefixNamespace, PrefixNamespace, StripNamespace } from "../../lib/namespace";
import { FanslyAnalyticsDatapoint } from "./entity";

export const methods = ["addDatapointsToPost"] as const;

export type AnalyticsHandlers = {
  addDatapointsToPost: (
    _: any,
    postId: string,
    datapoints: FanslyAnalyticsResponse
  ) => Promise<FanslyAnalyticsDatapoint[]>;
};

export const namespace = "analytics" as const;
export const analyticsMethods = methods.map((m) => prefixNamespace(namespace, m));
export type AnalyticsIpcChannel = keyof PrefixNamespace<AnalyticsHandlers, typeof namespace>;
export type AnalyticsIpcHandlers = {
  [K in AnalyticsIpcChannel]: AnalyticsHandlers[StripNamespace<K, typeof namespace>];
};
