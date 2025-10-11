import { db } from "../../../lib/db";
import { Post } from "../../posts/entity";
import { AnalyticsSummary } from "./api-type";

type DateRange = {
  startDate: Date;
  endDate: Date;
};

type TopPerformer = {
  id: string;
  caption: string;
  views: number;
  engagement: number;
  post: Post;
};

type TopPerformerByViews = {
  id: string;
  caption: string;
  views: number;
  post: Post;
};

/**
 * Calculate date ranges for current and previous periods
 */
export const calculatePeriodDateRanges = (
  startDate: Date,
  endDate: Date
): {
  currentPeriod: DateRange;
  previousPeriod: DateRange;
} => {
  // Calculate the duration of the current period
  const durationMs = endDate.getTime() - startDate.getTime();

  // Calculate previous period with same duration
  const previousPeriodEnd = new Date(startDate);
  previousPeriodEnd.setMilliseconds(previousPeriodEnd.getMilliseconds() - 1); // End just before current start

  const previousPeriodStart = new Date(previousPeriodEnd.getTime() - durationMs);

  return {
    currentPeriod: {
      startDate,
      endDate,
    },
    previousPeriod: {
      startDate: previousPeriodStart,
      endDate: previousPeriodEnd,
    },
  };
};

/**
 * Calculate percentage change between two values
 */
export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Fetch analytics summary for a specific date range
 */
export const getAnalyticsSummary = async (
  startDate: Date,
  endDate: Date
): Promise<AnalyticsSummary> => {
  const dataSource = await db();
  const postRepository = dataSource.getRepository(Post);

  const { currentPeriod, previousPeriod } = calculatePeriodDateRanges(startDate, endDate);

  // Fetch posts for current period
  const currentPosts = await postRepository
    .createQueryBuilder("post")
    .leftJoinAndSelect("post.channel", "channel")
    .leftJoinAndSelect("post.fanslyAnalyticsAggregate", "analytics")
    .where("channel.typeId = :typeId", { typeId: "fansly" })
    .andWhere("post.date BETWEEN :startDate AND :endDate", {
      startDate: currentPeriod.startDate,
      endDate: currentPeriod.endDate,
    })
    .andWhere("analytics.id IS NOT NULL")
    .getMany();

  // Fetch posts for previous period
  const previousPosts = await postRepository
    .createQueryBuilder("post")
    .leftJoinAndSelect("post.channel", "channel")
    .leftJoinAndSelect("post.fanslyAnalyticsAggregate", "analytics")
    .where("channel.typeId = :typeId", { typeId: "fansly" })
    .andWhere("post.date BETWEEN :startDate AND :endDate", {
      startDate: previousPeriod.startDate,
      endDate: previousPeriod.endDate,
    })
    .andWhere("analytics.id IS NOT NULL")
    .getMany();

  // Calculate current period metrics
  const currentTotalViews = currentPosts.reduce(
    (sum, post) => sum + (post.fanslyAnalyticsAggregate?.totalViews || 0),
    0
  );
  const currentAvgEngagement =
    currentPosts.length > 0
      ? currentPosts.reduce(
          (sum, post) => sum + (post.fanslyAnalyticsAggregate?.averageEngagementPercent || 0),
          0
        ) / currentPosts.length
      : 0;

  // Calculate previous period metrics
  const previousTotalViews = previousPosts.reduce(
    (sum, post) => sum + (post.fanslyAnalyticsAggregate?.totalViews || 0),
    0
  );
  const previousAvgEngagement =
    previousPosts.length > 0
      ? previousPosts.reduce(
          (sum, post) => sum + (post.fanslyAnalyticsAggregate?.averageEngagementPercent || 0),
          0
        ) / previousPosts.length
      : 0;

  // Calculate trends
  const viewsTrend = calculatePercentageChange(currentTotalViews, previousTotalViews);
  const engagementTrend = calculatePercentageChange(currentAvgEngagement, previousAvgEngagement);

  // Get top performers by engagement
  const topPerformers: TopPerformer[] = currentPosts
    .filter((post) => post.fanslyAnalyticsAggregate)
    .sort(
      (a, b) =>
        (b.fanslyAnalyticsAggregate?.averageEngagementPercent || 0) -
        (a.fanslyAnalyticsAggregate?.averageEngagementPercent || 0)
    )
    .slice(0, 5)
    .map((post) => ({
      id: post.id,
      caption: post.caption,
      views: post.fanslyAnalyticsAggregate?.totalViews || 0,
      engagement: post.fanslyAnalyticsAggregate?.averageEngagementPercent || 0,
      post,
    }));

  // Get top performers by views
  const topPerformersByViews: TopPerformerByViews[] = currentPosts
    .filter((post) => post.fanslyAnalyticsAggregate)
    .sort(
      (a, b) =>
        (b.fanslyAnalyticsAggregate?.totalViews || 0) -
        (a.fanslyAnalyticsAggregate?.totalViews || 0)
    )
    .slice(0, 5)
    .map((post) => ({
      id: post.id,
      caption: post.caption,
      views: post.fanslyAnalyticsAggregate?.totalViews || 0,
      post,
    }));

  return {
    engagementTrend,
    averageEngagementPercent: currentAvgEngagement,
    totalViews: currentTotalViews,
    viewsTrend,
    topPerformerIds: topPerformers.map((p) => p.id),
    topPerformers,
    topPerformersByViews,
  };
};
