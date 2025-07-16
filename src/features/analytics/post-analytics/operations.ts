import { db } from "../../../lib/db";
import { Post } from "../../posts/entity";
import { FanslyPostWithAnalytics, HashtagAnalytics, TimeAnalytics } from "./api-type";

export const getFanslyPostsWithAnalytics = async (
  sortBy = "date",
  sortDirection: "asc" | "desc" = "desc"
): Promise<FanslyPostWithAnalytics[]> => {
  const dataSource = await db();
  const postRepository = dataSource.getRepository(Post);

  const queryBuilder = postRepository
    .createQueryBuilder("post")
    .leftJoinAndSelect("post.channel", "channel")
    .leftJoinAndSelect("post.postMedia", "postMedia")
    .leftJoinAndSelect("postMedia.media", "media")
    .leftJoinAndSelect("post.fanslyAnalyticsAggregate", "analytics")
    .where("channel.typeId = :typeId", { typeId: "fansly" })
    .andWhere("analytics.id IS NOT NULL");

  // Add sorting
  switch (sortBy) {
    case "date":
      queryBuilder.orderBy("post.date", sortDirection === "asc" ? "ASC" : "DESC");
      break;
    case "views":
      queryBuilder.orderBy("analytics.totalViews", sortDirection === "asc" ? "ASC" : "DESC");
      break;
    case "engagement":
      queryBuilder.orderBy(
        "analytics.averageEngagementSeconds",
        sortDirection === "asc" ? "ASC" : "DESC"
      );
      break;
    case "engagementPercent":
      queryBuilder.orderBy(
        "analytics.averageEngagementPercent",
        sortDirection === "asc" ? "ASC" : "DESC"
      );
      break;
    case "videoLength":
      queryBuilder.orderBy("media.duration", sortDirection === "asc" ? "ASC" : "DESC");
      break;
  }

  const posts = await queryBuilder.getMany();

  return posts.map((post) => ({
    id: post.id,
    date: post.date,
    caption: post.caption,
    thumbnailUrl: post.postMedia[0]?.media ? `thumbnail://${post.postMedia[0].media.id}` : "",
    totalViews: post.fanslyAnalyticsAggregate?.totalViews || 0,
    averageEngagementSeconds: post.fanslyAnalyticsAggregate?.averageEngagementSeconds || 0,
    averageEngagementPercent: post.fanslyAnalyticsAggregate?.averageEngagementPercent || 0,
    hashtags: post.caption?.match(/#\w+/g) || [],
    videoLength: post.postMedia[0]?.media?.duration || 0,
  }));
};

export const getHashtagAnalytics = async (): Promise<HashtagAnalytics> => {
  const posts = await getFanslyPostsWithAnalytics();

  const hashtagMap = new Map<
    string,
    { totalViews: number; totalEngagement: number; count: number }
  >();

  posts.forEach((post) => {
    post.hashtags.forEach((hashtag) => {
      const existing = hashtagMap.get(hashtag) || { totalViews: 0, totalEngagement: 0, count: 0 };
      hashtagMap.set(hashtag, {
        totalViews: existing.totalViews + post.totalViews,
        totalEngagement: existing.totalEngagement + post.averageEngagementPercent,
        count: existing.count + 1,
      });
    });
  });

  return Array.from(hashtagMap.entries())
    .map(([hashtag, data]) => ({
      hashtag,
      postCount: data.count,
      avgViews: data.totalViews / data.count,
      avgEngagement: data.totalEngagement / data.count,
    }))
    .filter((entry) => entry.postCount >= 2)
    .sort((a, b) => b.avgEngagement - a.avgEngagement);
};

export const getTimeAnalytics = async (): Promise<TimeAnalytics> => {
  const posts = await getFanslyPostsWithAnalytics();

  const timeMap = new Map<string, { totalViews: number; totalEngagement: number; count: number }>();

  posts.forEach((post) => {
    const date = new Date(post.date);
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    const hour = date.getHours();
    const timeSlot = `${hour.toString().padStart(2, "0")}:00-${(hour + 1).toString().padStart(2, "0")}:00`;
    const timePeriod = `${dayName} ${timeSlot}`;

    const existing = timeMap.get(timePeriod) || { totalViews: 0, totalEngagement: 0, count: 0 };
    timeMap.set(timePeriod, {
      totalViews: existing.totalViews + post.totalViews,
      totalEngagement: existing.totalEngagement + post.averageEngagementPercent,
      count: existing.count + 1,
    });
  });

  return Array.from(timeMap.entries())
    .map(([timePeriod, data]) => ({
      timePeriod,
      postCount: data.count,
      avgViews: data.totalViews / data.count,
      avgEngagement: data.totalEngagement / data.count,
    }))
    .filter((entry) => entry.postCount >= 1)
    .sort((a, b) => b.avgEngagement - a.avgEngagement);
};