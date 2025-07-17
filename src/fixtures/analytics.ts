import {
  AnalyticsFetchHistory,
  FanslyAnalyticsAggregate,
  FanslyAnalyticsDatapoint,
} from "../features/analytics/entity";
import { db } from "../lib/db";

const ANALYTICS_DATAPOINT_FIXTURES: Omit<
  FanslyAnalyticsDatapoint,
  "createdAt" | "updatedAt" | "post"
>[] = [
  {
    id: "analytics-dp-001",
    postId: "post-001",
    timestamp: new Date("2024-01-10T13:00:00Z").getTime(),
    views: 150,
    interactionTime: 1000,
  },
  {
    id: "analytics-dp-002",
    postId: "post-001",
    timestamp: new Date("2024-01-10T18:00:00Z").getTime(),
    views: 450,
    interactionTime: 1000,
  },
  {
    id: "analytics-dp-003",
    postId: "post-002",
    timestamp: new Date("2024-01-12T19:00:00Z").getTime(),
    views: 320,
    interactionTime: 1000,
  },
  {
    id: "analytics-dp-004",
    postId: "post-002",
    timestamp: new Date("2024-01-13T06:00:00Z").getTime(),
    views: 890,
    interactionTime: 1000,
  },
  {
    id: "analytics-dp-005",
    postId: "post-003",
    timestamp: new Date("2024-01-15T22:00:00Z").getTime(),
    views: 567,
    interactionTime: 1000,
  },
  {
    id: "analytics-dp-006",
    postId: "post-003",
    timestamp: new Date("2024-01-16T08:00:00Z").getTime(),
    views: 1234,
    interactionTime: 1000,
  },
  {
    id: "analytics-dp-007",
    postId: "post-004",
    timestamp: new Date("2024-01-18T12:00:00Z").getTime(),
    views: 445,
    interactionTime: 1000,
  },
  {
    id: "analytics-dp-008",
    postId: "post-005",
    timestamp: new Date("2024-01-20T20:00:00Z").getTime(),
    views: 678,
    interactionTime: 1000,
  },
];

const ANALYTICS_AGGREGATE_FIXTURES: Omit<
  FanslyAnalyticsAggregate,
  "createdAt" | "updatedAt" | "post"
>[] = [
  {
    id: "analytics-agg-001",
    postId: "post-001",
    totalViews: 1250,
    averageEngagementSeconds: 1000,
    averageEngagementPercent: 0.1,
  },
  {
    id: "analytics-agg-002",
    postId: "post-002",
    totalViews: 2100,
    averageEngagementSeconds: 1000,
    averageEngagementPercent: 0.1,
  },
  {
    id: "analytics-agg-003",
    postId: "post-003",
    totalViews: 3450,
    averageEngagementSeconds: 1000,
    averageEngagementPercent: 0.1,
  },
  {
    id: "analytics-agg-004",
    postId: "post-004",
    totalViews: 1890,
    averageEngagementSeconds: 1000,
    averageEngagementPercent: 0.1,
  },
  {
    id: "analytics-agg-005",
    postId: "post-005",
    totalViews: 2750,
    averageEngagementSeconds: 1000,
    averageEngagementPercent: 0.1,
  },
];

const ANALYTICS_FETCH_HISTORY_FIXTURES: Omit<
  AnalyticsFetchHistory,
  "createdAt" | "updatedAt" | "post"
>[] = [
  {
    id: "fetch-history-001",
    postId: "post-001",
    timeframeIdentifier: "rolling-30d",
    timeframeType: "rolling",
    fetchedAt: new Date("2024-01-10T12:00:00Z"),
  },
  {
    id: "fetch-history-002",
    postId: "post-002",
    fetchedAt: new Date("2024-01-12T18:00:00Z"),
    timeframeIdentifier: "rolling-30d",
    timeframeType: "rolling",
  },
  {
    id: "fetch-history-003",
    postId: "post-003",
    fetchedAt: new Date("2024-01-15T21:00:00Z"),
    timeframeIdentifier: "rolling-30d",
    timeframeType: "rolling",
  },
  {
    id: "fetch-history-004",
    postId: "post-004",
    fetchedAt: new Date("2024-01-18T08:00:00Z"),
    timeframeIdentifier: "rolling-30d",
    timeframeType: "rolling",
  },
  {
    id: "fetch-history-005",
    postId: "post-005",
    fetchedAt: new Date("2024-01-20T16:00:00Z"),
    timeframeIdentifier: "rolling-30d",
    timeframeType: "rolling",
  },
  {
    id: "fetch-history-006",
    postId: "post-006",
    fetchedAt: new Date("2024-01-22T10:00:00Z"),
    timeframeIdentifier: "rolling-30d",
    timeframeType: "rolling",
  },
];

export const loadAnalyticsFixtures = async () => {
  const dataSource = await db();

  // Load Analytics Datapoints
  const datapointRepository = dataSource.getRepository(FanslyAnalyticsDatapoint);
  const existingDatapoints = await datapointRepository.find();

  const datapointPromises = ANALYTICS_DATAPOINT_FIXTURES.map(async (datapoint) => {
    if (existingDatapoints.find((d) => d.id === datapoint.id)) {
      return null;
    }
    return datapointRepository.save(datapoint);
  });

  await Promise.all(datapointPromises);

  // Load Analytics Aggregates
  const aggregateRepository = dataSource.getRepository(FanslyAnalyticsAggregate);
  const existingAggregates = await aggregateRepository.find();

  const aggregatePromises = ANALYTICS_AGGREGATE_FIXTURES.map(async (aggregate) => {
    if (existingAggregates.find((a) => a.id === aggregate.id)) {
      return null;
    }
    return aggregateRepository.save(aggregate);
  });

  await Promise.all(aggregatePromises);

  // Load Analytics Fetch History
  const fetchHistoryRepository = dataSource.getRepository(AnalyticsFetchHistory);
  const existingFetchHistory = await fetchHistoryRepository.find();

  const fetchHistoryPromises = ANALYTICS_FETCH_HISTORY_FIXTURES.map(async (fetchHistory) => {
    if (existingFetchHistory.find((f) => f.id === fetchHistory.id)) {
      return null;
    }
    return fetchHistoryRepository.save(fetchHistory);
  });

  await Promise.all(fetchHistoryPromises);
};
