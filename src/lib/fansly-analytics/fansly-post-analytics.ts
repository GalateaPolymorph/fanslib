import { Post } from "../../features/posts/entity";

type AnalyticsPeriod = "day1" | "day7" | "day14" | "day30" | "all";
type FanslyFYPStat =
  | {
      period: AnalyticsPeriod;
      hasData: true;
      views: number;
      averageInteractionTimeMs: number;
      averageInteractionPercent: number;
    }
  | {
      period: AnalyticsPeriod;
      hasData: false;
    };
type FanslyPostAnalytics = {
  postDate: Date;
  videoLengthMs: number;
  fypStats: FanslyFYPStat[];
};

export const calculateFanslyPostAnalytics = (post: Post): FanslyPostAnalytics => {
  const postDate = new Date(post.date);
  const videoLengthMs = (post.postMedia?.[0]?.media?.duration || 0) * 1000;
  const now = new Date();
  const postAgeInDays = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24));

  const periods = [
    { name: "day1", days: 1 },
    { name: "day7", days: 7 },
    { name: "day14", days: 14 },
    { name: "day30", days: 30 },
  ].filter((period) => period.days <= postAgeInDays);

  // Add the 'all' period which will always be included
  const allPeriods = [...periods, { name: "all", days: Infinity }];

  const fypStats = allPeriods.map((period) => {
    const relevantDatapoints = (post.fanslyAnalyticsDatapoints || []).filter((datapoint) => {
      const daysSincePost = Math.floor(
        (datapoint.timestamp - postDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysSincePost <= period.days && daysSincePost >= 0;
    });

    const totalViews = relevantDatapoints.reduce((sum, stat) => sum + stat.views, 0);
    const totalInteractionTime = relevantDatapoints.reduce(
      (sum, stat) => sum + stat.interactionTime,
      0
    );
    const averageInteractionTimeMs = totalViews > 0 ? totalInteractionTime / totalViews : 0;
    const averageInteractionPercent = videoLengthMs
      ? Math.round((averageInteractionTimeMs / videoLengthMs) * 100)
      : 0;

    return {
      period: period.name as AnalyticsPeriod,
      hasData: true as const,
      views: totalViews,
      averageInteractionTimeMs,
      averageInteractionPercent,
    };
  });

  return {
    postDate,
    videoLengthMs,
    fypStats,
  };
};
