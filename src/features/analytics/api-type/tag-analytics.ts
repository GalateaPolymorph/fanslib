export type TagAnalyticsParams = {
  tagIds?: number[];
  dimensionIds?: number[];
  timeRange?: { start: Date; end: Date };
  metrics?: string[];
};

export type TagPerformanceMetrics = {
  tagId: number;
  tagName: string;
  dimensionName: string;
  totalAssignments: number;
  averageEngagement: number;
  topPerformingMedia: string[];
  trendDirection: "up" | "down" | "stable";
  confidenceScore: number;
};

export type TagCorrelationData = {
  tagId1: number;
  tagId2: number;
  correlationStrength: number;
  combinedPerformance: number;
  coOccurrenceCount: number;
};