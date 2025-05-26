import { db } from "../../lib/db";
import { MediaTag } from "../tags/entity";
import { TagAnalyticsParams, TagCorrelationData, TagPerformanceMetrics } from "./api-type";

export const getTagAnalytics = async (
  params: TagAnalyticsParams
): Promise<TagPerformanceMetrics[]> => {
  const dataSource = await db();

  const queryBuilder = dataSource
    .createQueryBuilder(MediaTag, "mt")
    .leftJoinAndSelect("mt.tag", "tag")
    .leftJoinAndSelect("tag.dimension", "dimension")
    .leftJoinAndSelect("mt.media", "media")
    .leftJoin("media.postMedia", "postMedia")
    .leftJoin("postMedia.post", "post")
    .leftJoinAndSelect("post.fanslyAnalyticsAggregate", "analytics");

  if (params.tagIds?.length) {
    queryBuilder.andWhere("mt.tagDefinitionId IN (:...tagIds)", { tagIds: params.tagIds });
  }

  if (params.dimensionIds?.length) {
    queryBuilder.andWhere("tag.dimensionId IN (:...dimensionIds)", {
      dimensionIds: params.dimensionIds,
    });
  }

  if (params.timeRange) {
    queryBuilder.andWhere("mt.assignedAt BETWEEN :start AND :end", {
      start: params.timeRange.start,
      end: params.timeRange.end,
    });
  }

  const mediaTags = await queryBuilder.getMany();

  const tagMetrics = mediaTags.reduce(
    (acc, mt) => {
      const tagId = mt.tagDefinitionId;
      if (!acc[tagId]) {
        acc[tagId] = {
          tagId,
          tagName: mt.tag?.displayName || "Unknown Tag",
          dimensionName: mt.tag?.dimension?.name || "Unknown Dimension",
          totalAssignments: 0,
          totalEngagement: 0,
          totalViews: 0,
          mediaIds: [],
          recentPerformance: 0,
          olderPerformance: 0,
          recentCount: 0,
          olderCount: 0,
        };
      }

      acc[tagId].totalAssignments++;
      acc[tagId].mediaIds.push(mt.mediaId);

      // Calculate engagement score using actual analytics data
      const analytics = mt.media?.postMedia?.[0]?.post?.fanslyAnalyticsAggregate;
      const engagementScore = analytics
        ? (analytics.totalViews * analytics.averageEngagementPercent) / 100
        : 0;

      const views = analytics?.totalViews || 0;

      acc[tagId].totalEngagement += engagementScore;
      acc[tagId].totalViews += views;

      // Calculate trend by comparing recent vs older posts
      const postDate = mt.media?.postMedia?.[0]?.post?.date;
      if (postDate) {
        const post = new Date(postDate);
        const now = new Date();
        const daysSincePost = (now.getTime() - post.getTime()) / (1000 * 60 * 60 * 24);

        if (daysSincePost <= 14) {
          acc[tagId].recentPerformance += engagementScore;
          acc[tagId].recentCount++;
        } else if (daysSincePost <= 30) {
          acc[tagId].olderPerformance += engagementScore;
          acc[tagId].olderCount++;
        }
      }

      return acc;
    },
    {} as Record<number, any>
  );

  return Object.values(tagMetrics).map((metric) => {
    const averageEngagement = metric.totalEngagement / metric.totalAssignments;
    const recentAverage =
      metric.recentCount > 0 ? metric.recentPerformance / metric.recentCount : 0;
    const olderAverage = metric.olderCount > 0 ? metric.olderPerformance / metric.olderCount : 0;

    // Calculate trend direction
    let trendDirection: "up" | "down" | "stable" = "stable";
    if (metric.recentCount > 0 && metric.olderCount > 0) {
      const trendThreshold = 0.1; // 10% change threshold
      const changeRatio = (recentAverage - olderAverage) / olderAverage;

      if (changeRatio > trendThreshold) {
        trendDirection = "up";
      } else if (changeRatio < -trendThreshold) {
        trendDirection = "down";
      }
    }

    return {
      tagId: metric.tagId,
      tagName: metric.tagName,
      dimensionName: metric.dimensionName,
      totalAssignments: metric.totalAssignments,
      averageEngagement,
      topPerformingMedia: metric.mediaIds.slice(0, 5),
      trendDirection,
      confidenceScore: Math.min(metric.totalAssignments / 10, 1),
    };
  });
};

export const getTagCorrelations = async (dimensionId?: number): Promise<TagCorrelationData[]> => {
  const dataSource = await db();

  const queryBuilder = dataSource
    .createQueryBuilder(MediaTag, "mt1")
    .innerJoin(MediaTag, "mt2", "mt1.mediaId = mt2.mediaId AND mt1.id != mt2.id")
    .leftJoinAndSelect("mt1.tag", "tag1")
    .leftJoinAndSelect("mt2.tag", "tag2");

  if (dimensionId) {
    queryBuilder
      .andWhere("tag1.dimensionId = :dimensionId", { dimensionId })
      .andWhere("tag2.dimensionId = :dimensionId", { dimensionId });
  }

  const correlations = await queryBuilder.getMany();

  // Process correlation data
  const correlationMap = new Map<string, TagCorrelationData>();

  correlations.forEach((mt1) => {
    correlations.forEach((mt2) => {
      if (mt1.tagDefinitionId >= mt2.tagDefinitionId) return;

      const key = `${mt1.tagDefinitionId}-${mt2.tagDefinitionId}`;
      if (!correlationMap.has(key)) {
        correlationMap.set(key, {
          tagId1: mt1.tagDefinitionId,
          tagId2: mt2.tagDefinitionId,
          correlationStrength: 0,
          combinedPerformance: 0,
          coOccurrenceCount: 0,
        });
      }

      const correlation = correlationMap.get(key)!;
      correlation.coOccurrenceCount++;
    });
  });

  return Array.from(correlationMap.values());
};

export const getTagTrends = async (
  tagIds: number[],
  timeRange: { start: Date; end: Date }
): Promise<any> => {
  const dataSource = await db();

  const trends = await dataSource
    .createQueryBuilder(MediaTag, "mt")
    .select(["mt.tagDefinitionId", "DATE(mt.assignedAt) as date", "COUNT(*) as assignments"])
    .where("mt.tagDefinitionId IN (:...tagIds)", { tagIds })
    .andWhere("mt.assignedAt BETWEEN :start AND :end", timeRange)
    .groupBy("mt.tagDefinitionId, DATE(mt.assignedAt)")
    .orderBy("date", "ASC")
    .getRawMany();

  return trends;
};
