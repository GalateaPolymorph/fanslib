import { FanslyAnalyticsResponse } from "src/lib/fansly-analytics/fansly-analytics-response";
import { db } from "../../lib/db";
import { Post } from "../posts/entity";
import { FanslyAnalyticsDatapoint } from "./entity";

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
            views: s.views,
            interactionTime: s.interactionTime,
          }))
  );

type CreateFanslyAnalyticsDatapointPayload = Omit<
  FanslyAnalyticsDatapoint,
  "id" | "post" | "postId"
>;

export const addDatapointsToPost = async (postId: string, response: FanslyAnalyticsResponse) => {
  const dataSource = await db();
  const postRepository = dataSource.getRepository(Post);
  const dpRepo = dataSource.getRepository(FanslyAnalyticsDatapoint);

  const post = await postRepository.findOne({ where: { id: postId } });
  if (!post) {
    throw new Error("Post not found");
  }

  const datapoints = gatherFanslyPostAnalyticsDatapoints(response);

  return Promise.all(
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
};
