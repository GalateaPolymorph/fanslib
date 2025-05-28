import { db } from "../../lib/db";
import { aggregatePostAnalyticsData } from "../../lib/fansly-analytics/aggregate";
import { FanslyAnalyticsResponse } from "../../lib/fansly-analytics/fansly-analytics-response";
import { saveHashtagsFromAnalytics } from "../hashtags/operations";
import { Post } from "../posts/entity";
import { FanslyAnalyticsAggregate, FanslyAnalyticsDatapoint } from "./entity";

const gatherFanslyPostAnalyticsDatapoints = (
  response: FanslyAnalyticsResponse
): CreateFanslyAnalyticsDatapointPayload[] =>
  response.response.dataset.datapoints.flatMap((datapoint) =>
    datapoint.stats.length === 0
      ? [{ timestamp: datapoint.timestamp, views: 0, interactionTime: 0 }]
      : datapoint.stats
          .filter((s) => s.type === 0)
          .map((s) => ({
            timestamp: datapoint.timestamp,
            views: s.views + s.previewViews,
            interactionTime: s.interactionTime + s.previewInteractionTime,
          }))
  );

type CreateFanslyAnalyticsDatapointPayload = Omit<
  FanslyAnalyticsDatapoint,
  "id" | "post" | "postId"
>;

export const addDatapointsToPost = async (
  postId: string,
  response: FanslyAnalyticsResponse
): Promise<FanslyAnalyticsDatapoint[]> => {
  const dataSource = await db();
  const postRepository = dataSource.getRepository(Post);
  const dpRepo = dataSource.getRepository(FanslyAnalyticsDatapoint);
  const aggregateRepo = dataSource.getRepository(FanslyAnalyticsAggregate);

  const post = await postRepository.findOne({
    where: { id: postId },
    relations: { channel: true, postMedia: { media: true } },
  });
  if (!post) {
    throw new Error("Post not found");
  }
  // Process hashtags if this is a Fansly post
  if (post.channel.typeId === "fansly" && response.response.aggregationData?.tags) {
    try {
      await saveHashtagsFromAnalytics(post.channel.id, response);
      console.log(
        `Processed ${response.response.aggregationData.tags.length} hashtags from analytics`
      );
    } catch (error) {
      console.error("Failed to process hashtags from analytics:", error);
      // Continue with datapoints even if hashtag processing fails
    }
  }

  const datapoints = gatherFanslyPostAnalyticsDatapoints(response);
  const savedDatapoints = await Promise.all(
    datapoints.map(async (dp) => {
      const existingDatapointForTimestamp = await dpRepo.findOne({
        where: { timestamp: dp.timestamp, postId },
      });

      if (existingDatapointForTimestamp) {
        const updatedDatapoint = dpRepo.merge(existingDatapointForTimestamp, { post }, dp);
        return dpRepo.save(updatedDatapoint);
      }

      const newDatapoint = dpRepo.create({
        ...dp,
        post,
        postId,
      });
      return dpRepo.save(newDatapoint);
    })
  );

  // Reload the post with all required relations for aggregation
  const postWithDatapoints = await postRepository.findOne({
    where: { id: postId },
    relations: {
      fanslyAnalyticsDatapoints: true,
      postMedia: { media: true },
    },
  });

  if (!postWithDatapoints) {
    throw new Error("Post not found after saving datapoints");
  }

  // Update aggregate data
  const aggregatedData = aggregatePostAnalyticsData(postWithDatapoints, false);

  const existingAggregate = await aggregateRepo.findOne({
    where: { postId },
  });

  if (existingAggregate) {
    existingAggregate.totalViews = aggregatedData.at(-1)?.Views ?? 0;
    existingAggregate.averageEngagementSeconds =
      aggregatedData.at(-1)?.averageWatchTimeSeconds ?? 0;
    existingAggregate.averageEngagementPercent =
      aggregatedData.at(-1)?.averageWatchTimePercent ?? 0;
    await aggregateRepo.save(existingAggregate);
  } else {
    const newAggregate = aggregateRepo.create({
      post,
      postId,
      totalViews: aggregatedData.at(-1)?.Views ?? 0,
      averageEngagementSeconds: aggregatedData.at(-1)?.averageWatchTimeSeconds ?? 0,
      averageEngagementPercent: aggregatedData.at(-1)?.averageWatchTimePercent ?? 0,
    });
    await aggregateRepo.save(newAggregate);
  }

  return savedDatapoints;
};

export const initializeAnalyticsAggregates = async (): Promise<void> => {
  const dataSource = await db();
  const postRepository = dataSource.getRepository(Post);
  const aggregateRepo = dataSource.getRepository(FanslyAnalyticsAggregate);

  // Find all posts that have datapoints but no aggregate
  const posts = await postRepository
    .createQueryBuilder("post")
    .leftJoinAndSelect("post.fanslyAnalyticsDatapoints", "datapoints")
    .leftJoinAndSelect("post.fanslyAnalyticsAggregate", "aggregate")
    .leftJoinAndSelect("post.postMedia", "postMedia")
    .leftJoinAndSelect("postMedia.media", "media")
    .where("datapoints.id IS NOT NULL")
    .andWhere("aggregate.id IS NULL")
    .getMany();

  await Promise.all(
    posts.map(async (post) => {
      const aggregated = aggregatePostAnalyticsData(post, false);

      if (!aggregated.at(-1)) {
        return;
      }

      const existingAggregate = await aggregateRepo.findOne({
        where: { postId: post.id },
      });

      if (existingAggregate) {
        existingAggregate.totalViews = aggregated.at(-1)?.Views ?? 0;
        existingAggregate.averageEngagementSeconds =
          aggregated.at(-1)?.averageWatchTimeSeconds ?? 0;
        existingAggregate.averageEngagementPercent =
          aggregated.at(-1)?.averageWatchTimePercent ?? 0;
        await aggregateRepo.save(existingAggregate);
      } else {
        const newAggregate = aggregateRepo.create({
          post,
          postId: post.id,
          totalViews: aggregated.at(-1)?.Views ?? 0,
          averageEngagementSeconds: aggregated.at(-1)?.averageWatchTimeSeconds ?? 0,
          averageEngagementPercent: aggregated.at(-1)?.averageWatchTimePercent ?? 0,
        });

        await aggregateRepo.save(newAggregate);
      }
    })
  );
};
