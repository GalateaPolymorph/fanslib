import { db } from "../../lib/db";
import { Post } from "../posts/entity";
import { FanslyAnalyticsDatapoint } from "./entity";

export type FypMetrics = {
  viewVelocity: number;
  sustainedGrowth: number;
  plateauPoint: number;
  isUnderperforming: boolean;
};

export const calculateFypPerformanceScore = async (
  post: Post,
  datapoints: FanslyAnalyticsDatapoint[]
): Promise<number> => {
  if (datapoints.length === 0) {
    return 0;
  }

  // Sort datapoints by timestamp
  const sortedDatapoints = [...datapoints].sort((a, b) => a.timestamp - b.timestamp);

  // Calculate basic metrics
  const totalViews = sortedDatapoints[sortedDatapoints.length - 1]?.views || 0;
  const totalEngagementTime = sortedDatapoints.reduce((sum, dp) => sum + dp.interactionTime, 0);
  const averageEngagementTime = totalEngagementTime / sortedDatapoints.length;

  // Calculate view velocity (views per day)
  const timeSpanDays = calculateTimeSpanDays(sortedDatapoints);
  const viewVelocity = timeSpanDays > 0 ? totalViews / timeSpanDays : 0;

  // Calculate sustained growth rate
  const sustainedGrowth = calculateSustainedGrowth(sortedDatapoints);

  // Get user's historical performance for dynamic threshold
  const userThreshold = await calculateUserPerformanceThreshold(post.channelId);

  // Calculate normalized performance score (0-100)
  const viewScore = Math.min(100, (totalViews / Math.max(userThreshold.averageViews, 1)) * 50);
  const velocityScore = Math.min(
    100,
    (viewVelocity / Math.max(userThreshold.averageVelocity, 1)) * 30
  );
  const engagementScore = Math.min(
    100,
    (averageEngagementTime / Math.max(userThreshold.averageEngagement, 1)) * 20
  );

  const performanceScore = viewScore + velocityScore + engagementScore;

  return Math.min(100, Math.max(0, performanceScore));
};

export const findPlateauDay = (datapoints: FanslyAnalyticsDatapoint[]): number => {
  if (datapoints.length < 3) {
    return 0;
  }

  const sortedDatapoints = [...datapoints].sort((a, b) => a.timestamp - b.timestamp);

  // Calculate growth rates between consecutive datapoints
  const growthRates: number[] = [];
  for (let i = 1; i < sortedDatapoints.length; i++) {
    const prevViews = sortedDatapoints[i - 1].views;
    const currViews = sortedDatapoints[i].views;
    const growthRate = prevViews > 0 ? ((currViews - prevViews) / prevViews) * 100 : 0;
    growthRates.push(growthRate);
  }

  // Find the point where growth rate drops below 5% for consecutive periods
  const plateauThreshold = 5; // 5% growth rate threshold
  let consecutiveLowGrowth = 0;
  const minConsecutivePeriods = 2;

  for (let i = 0; i < growthRates.length; i++) {
    if (growthRates[i] < plateauThreshold) {
      consecutiveLowGrowth++;
      if (consecutiveLowGrowth >= minConsecutivePeriods) {
        // Return the day index where plateau started
        return Math.max(0, i - minConsecutivePeriods + 1);
      }
    } else {
      consecutiveLowGrowth = 0;
    }
  }

  // No plateau detected
  return 0;
};

export const calculateFypMetrics = async (
  post: Post,
  datapoints: FanslyAnalyticsDatapoint[]
): Promise<FypMetrics> => {
  if (datapoints.length === 0) {
    return {
      viewVelocity: 0,
      sustainedGrowth: 0,
      plateauPoint: 0,
      isUnderperforming: true,
    };
  }

  const sortedDatapoints = [...datapoints].sort((a, b) => a.timestamp - b.timestamp);

  // Calculate view velocity (views per day)
  const timeSpanDays = calculateTimeSpanDays(sortedDatapoints);
  const totalViews = sortedDatapoints[sortedDatapoints.length - 1]?.views || 0;
  const viewVelocity = timeSpanDays > 0 ? totalViews / timeSpanDays : 0;

  // Calculate sustained growth rate
  const sustainedGrowth = calculateSustainedGrowth(sortedDatapoints);

  // Find plateau point
  const plateauPoint = findPlateauDay(sortedDatapoints);

  // Determine if underperforming based on user's historical data
  const userThreshold = await calculateUserPerformanceThreshold(post.channelId);
  const isUnderperforming = totalViews < userThreshold.averageViews * 0.5; // 50% of average

  return {
    viewVelocity,
    sustainedGrowth,
    plateauPoint,
    isUnderperforming,
  };
};

const calculateTimeSpanDays = (datapoints: FanslyAnalyticsDatapoint[]): number => {
  if (datapoints.length < 2) {
    return 0;
  }

  const firstTimestamp = datapoints[0].timestamp;
  const lastTimestamp = datapoints[datapoints.length - 1].timestamp;
  const timeDifferenceMs = lastTimestamp - firstTimestamp;
  const timeDifferenceDays = timeDifferenceMs / (1000 * 60 * 60 * 24);

  return Math.max(1, timeDifferenceDays);
};

const calculateSustainedGrowth = (datapoints: FanslyAnalyticsDatapoint[]): number => {
  if (datapoints.length < 3) {
    return 0;
  }

  // Calculate growth rates between consecutive datapoints
  const growthRates: number[] = [];
  for (let i = 1; i < datapoints.length; i++) {
    const prevViews = datapoints[i - 1].views;
    const currViews = datapoints[i].views;
    const growthRate = prevViews > 0 ? ((currViews - prevViews) / prevViews) * 100 : 0;
    growthRates.push(growthRate);
  }

  // Calculate average growth rate
  const averageGrowthRate = growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length;

  return Math.max(0, averageGrowthRate);
};

const calculateUserPerformanceThreshold = async (
  channelId: string
): Promise<{
  averageViews: number;
  averageVelocity: number;
  averageEngagement: number;
}> => {
  const dataSource = await db();
  const postRepository = dataSource.getRepository(Post);

  // Get user's historical posts with analytics from the last 90 days
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const historicalPosts = await postRepository
    .createQueryBuilder("post")
    .leftJoinAndSelect("post.fanslyAnalyticsAggregate", "analytics")
    .leftJoinAndSelect("post.fanslyAnalyticsDatapoints", "datapoints")
    .where("post.channelId = :channelId", { channelId })
    .andWhere("post.createdAt >= :ninetyDaysAgo", { ninetyDaysAgo: ninetyDaysAgo.toISOString() })
    .andWhere("analytics.id IS NOT NULL")
    .getMany();

  if (historicalPosts.length === 0) {
    // Default thresholds if no historical data
    return {
      averageViews: 100,
      averageVelocity: 10,
      averageEngagement: 30,
    };
  }

  // Calculate averages from historical data
  const totalViews = historicalPosts.reduce((sum, post) => {
    return sum + (post.fanslyAnalyticsAggregate?.totalViews || 0);
  }, 0);

  const totalEngagement = historicalPosts.reduce((sum, post) => {
    return sum + (post.fanslyAnalyticsAggregate?.averageEngagementSeconds || 0);
  }, 0);

  const averageViews = totalViews / historicalPosts.length;
  const averageEngagement = totalEngagement / historicalPosts.length;

  // Calculate average velocity from historical posts
  let totalVelocity = 0;
  let velocityCount = 0;

  for (const post of historicalPosts) {
    if (post.fanslyAnalyticsDatapoints && post.fanslyAnalyticsDatapoints.length > 0) {
      const timeSpanDays = calculateTimeSpanDays(post.fanslyAnalyticsDatapoints);
      const postViews = post.fanslyAnalyticsAggregate?.totalViews || 0;
      const velocity = timeSpanDays > 0 ? postViews / timeSpanDays : 0;
      totalVelocity += velocity;
      velocityCount++;
    }
  }

  const averageVelocity = velocityCount > 0 ? totalVelocity / velocityCount : 10;

  return {
    averageViews,
    averageVelocity,
    averageEngagement,
  };
};
