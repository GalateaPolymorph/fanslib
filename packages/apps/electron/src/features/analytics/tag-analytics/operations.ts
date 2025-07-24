import { db } from "../../../lib/db";
import { MediaTag } from "../../tags/entity";
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
        };
      }

      acc[tagId].totalAssignments += 1;
      acc[tagId].mediaIds.push(mt.media?.id || "");

      // Add analytics data if available
      if (mt.media?.postMedia?.[0]?.post?.fanslyAnalyticsAggregate) {
        const analytics = mt.media.postMedia[0].post.fanslyAnalyticsAggregate;
        acc[tagId].totalEngagement += analytics.averageEngagementPercent || 0;
        acc[tagId].totalViews += analytics.totalViews || 0;
        acc[tagId].recentPerformance = analytics.averageEngagementPercent || 0;
      }

      return acc;
    },
    {} as Record<number, any>
  );

  return Object.values(tagMetrics).map((metric) => ({
    tagId: metric.tagId,
    tagName: metric.tagName,
    dimensionName: metric.dimensionName,
    totalAssignments: metric.totalAssignments,
    averageEngagement:
      metric.totalAssignments > 0 ? metric.totalEngagement / metric.totalAssignments : 0,
    topPerformingMedia: metric.mediaIds.slice(0, 5),
    trendDirection:
      metric.recentPerformance > metric.totalEngagement / metric.totalAssignments ? "up" : "down",
    confidenceScore: Math.min(metric.totalAssignments / 10, 1),
  }));
};

export const getTagCorrelations = async (dimensionId?: number): Promise<TagCorrelationData[]> => {
  const dataSource = await db();

  const queryBuilder = dataSource
    .createQueryBuilder(MediaTag, "mt1")
    .innerJoin(
      MediaTag,
      "mt2",
      "mt1.mediaId = mt2.mediaId AND mt1.tagDefinitionId < mt2.tagDefinitionId"
    )
    .leftJoinAndSelect("mt1.tag", "tag1")
    .leftJoinAndSelect("mt2.tag", "tag2")
    .leftJoinAndSelect("mt1.media", "media")
    .leftJoin("media.postMedia", "postMedia")
    .leftJoin("postMedia.post", "post")
    .leftJoinAndSelect("post.fanslyAnalyticsAggregate", "analytics");

  if (dimensionId) {
    queryBuilder.andWhere("tag1.dimensionId = :dimensionId OR tag2.dimensionId = :dimensionId", {
      dimensionId,
    });
  }

  const correlations = await queryBuilder.getMany();

  const correlationMap = correlations.reduce(
    (acc, mt) => {
      // This is a simplified correlation calculation
      const key = `${mt.tagDefinitionId}-${mt.mediaId}`;
      if (!acc[key]) {
        acc[key] = {
          tagId1: mt.tagDefinitionId,
          tagId2: 0, // This would need to be properly mapped from the second media tag
          correlationStrength: 0.5, // Placeholder
          combinedPerformance: 0,
          coOccurrenceCount: 0,
        };
      }
      acc[key].coOccurrenceCount += 1;
      return acc;
    },
    {} as Record<string, TagCorrelationData>
  );

  return Object.values(correlationMap);
};

export const getTagTrends = async (tagIds: number[], timeRange: { start: Date; end: Date }) => {
  const dataSource = await db();

  const queryBuilder = dataSource
    .createQueryBuilder(MediaTag, "mt")
    .leftJoinAndSelect("mt.tag", "tag")
    .leftJoinAndSelect("mt.media", "media")
    .leftJoin("media.postMedia", "postMedia")
    .leftJoin("postMedia.post", "post")
    .leftJoinAndSelect("post.fanslyAnalyticsAggregate", "analytics")
    .where("mt.tagDefinitionId IN (:...tagIds)", { tagIds })
    .andWhere("mt.assignedAt BETWEEN :start AND :end", {
      start: timeRange.start,
      end: timeRange.end,
    });

  const trends = await queryBuilder.getMany();

  // Group by time periods and calculate trends
  const trendData = trends.reduce(
    (acc, mt) => {
      const tagId = mt.tagDefinitionId;
      if (!acc[tagId]) {
        acc[tagId] = {
          tagId,
          tagName: mt.tag?.displayName || "Unknown Tag",
          dataPoints: [],
          overallTrend: "stable",
        };
      }

      if (mt.media?.postMedia?.[0]?.post?.fanslyAnalyticsAggregate) {
        const analytics = mt.media.postMedia[0].post.fanslyAnalyticsAggregate;
        acc[tagId].dataPoints.push({
          date: mt.assignedAt,
          engagement: analytics.averageEngagementPercent || 0,
          views: analytics.totalViews || 0,
        });
      }

      return acc;
    },
    {} as Record<number, any>
  );

  return Object.values(trendData);
};
