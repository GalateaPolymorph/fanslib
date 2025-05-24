import { db } from "../../lib/db";
import { Post } from "../posts/entity";
import { FanslyPostWithAnalytics } from "./api-type";

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
