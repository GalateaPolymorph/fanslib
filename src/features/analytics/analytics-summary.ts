import { db } from "../../lib/db";
import { Post } from "../posts/entity";
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
 * Fetch posts with analytics data for a specific date range
 */
export const getPostsWithAnalytics = async (
  dateRange: DateRange,
  includeMedia = false
): Promise<Post[]> => {
  const dataSource = await db();
  const postRepository = dataSource.getRepository(Post);

  const query = postRepository
    .createQueryBuilder("post")
    .leftJoinAndSelect("post.channel", "channel")
    .leftJoinAndSelect("post.fanslyAnalyticsAggregate", "analytics")
    .where("channel.typeId = :typeId", { typeId: "fansly" })
    .andWhere("analytics.id IS NOT NULL")
    .andWhere("post.createdAt >= :startDate", { startDate: dateRange.startDate })
    .andWhere("post.createdAt <= :endDate", { endDate: dateRange.endDate });

  if (includeMedia) {
    query
      .leftJoinAndSelect("post.postMedia", "postMedia")
      .leftJoinAndSelect("postMedia.media", "media");
  }

  return query.orderBy("analytics.averageEngagementSeconds", "DESC").getMany();
};

/**
 * Calculate average engagement rate from posts
 */
export const calculateAverageEngagement = (posts: Post[]): number => {
  const engagementRates = posts.map(
    (post) => post.fanslyAnalyticsAggregate?.averageEngagementPercent || 0
  );

  return engagementRates.length > 0
    ? engagementRates.reduce((sum, rate) => sum + rate, 0) / engagementRates.length
    : 0;
};

/**
 * Get top performing posts with relevant metrics and complete post data
 */
export const getTopPerformers = (posts: Post[], limit = 3): TopPerformer[] => {
  return posts.slice(0, limit).map((post) => ({
    id: post.id,
    caption: post.caption || "",
    views: post.fanslyAnalyticsAggregate?.totalViews || 0,
    engagement: parseFloat(
      post.fanslyAnalyticsAggregate?.averageEngagementSeconds.toFixed(1) || "0"
    ),
    post,
  }));
};

/**
 * Get top performing posts by views with relevant metrics and complete post data
 */
export const getTopPerformersByViews = (posts: Post[], limit = 3): TopPerformerByViews[] => {
  return [...posts]
    .sort(
      (a, b) =>
        (b.fanslyAnalyticsAggregate?.totalViews || 0) -
        (a.fanslyAnalyticsAggregate?.totalViews || 0)
    )
    .slice(0, limit)
    .map((post) => ({
      id: post.id,
      caption: post.caption || "",
      views: post.fanslyAnalyticsAggregate?.totalViews || 0,
      post,
    }));
};

/**
 * Calculate total views from all posts
 */
export const calculateTotalViews = (posts: Post[]): number => {
  return posts.reduce((sum, post) => sum + (post.fanslyAnalyticsAggregate?.totalViews || 0), 0);
};

/**
 * Get analytics summary including trends and engagement metrics
 */
export const getAnalyticsSummary = async (
  startDate: Date,
  endDate: Date
): Promise<AnalyticsSummary> => {
  try {
    const { currentPeriod, previousPeriod } = calculatePeriodDateRanges(startDate, endDate);

    // Get posts for both periods
    const currentPeriodPosts = await getPostsWithAnalytics(currentPeriod, true);
    const previousPeriodPosts = await getPostsWithAnalytics(previousPeriod);

    // If no posts found, return zeros
    if (currentPeriodPosts.length === 0) {
      return {
        engagementTrend: 0,
        averageEngagementPercent: 0,
        totalViews: 0,
        viewsTrend: 0,
        topPerformerIds: [],
        topPerformers: [],
        topPerformersByViews: [],
      };
    }

    // Calculate metrics
    const currentAverageEngagement = calculateAverageEngagement(currentPeriodPosts);
    const previousAverageEngagement = calculateAverageEngagement(previousPeriodPosts);

    const currentTotalViews = calculateTotalViews(currentPeriodPosts);
    const previousTotalViews = calculateTotalViews(previousPeriodPosts);

    const engagementTrend =
      previousAverageEngagement === 0
        ? 0
        : ((currentAverageEngagement - previousAverageEngagement) / previousAverageEngagement) *
          100;

    const viewsTrend =
      previousTotalViews === 0
        ? 0
        : ((currentTotalViews - previousTotalViews) / previousTotalViews) * 100;

    const topPerformers = getTopPerformers(currentPeriodPosts);
    const topPerformersByViews = getTopPerformersByViews(currentPeriodPosts);

    return {
      engagementTrend: parseFloat(engagementTrend.toFixed(1)),
      averageEngagementPercent: parseFloat(currentAverageEngagement.toFixed(1)),
      totalViews: currentTotalViews,
      viewsTrend: parseFloat(viewsTrend.toFixed(1)),
      topPerformerIds: topPerformers.map((p) => p.id),
      topPerformers,
      topPerformersByViews,
    };
  } catch (error) {
    // Return default values in case of error
    return {
      engagementTrend: 0,
      averageEngagementPercent: 0,
      totalViews: 0,
      viewsTrend: 0,
      topPerformerIds: [],
      topPerformers: [],
      topPerformersByViews: [],
    };
  }
};
