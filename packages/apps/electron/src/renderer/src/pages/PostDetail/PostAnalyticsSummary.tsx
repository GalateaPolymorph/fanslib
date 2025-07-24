import { CategoryBar } from "@renderer/components/tremor/CategoryBar";
import { useMemo } from "react";
import { Post } from "../../../../features/posts/entity";
import {
  aggregatePostAnalyticsData,
  formatNumber,
  formatToDecimalSeconds,
} from "../../../../lib/fansly-analytics";

type PostAnalyticsSummaryProps = {
  post: Post;
};

export const PostAnalyticsSummary = ({ post }: PostAnalyticsSummaryProps) => {
  const graphData = useMemo(() => aggregatePostAnalyticsData(post, false), [post]);

  const relevantMedia = useMemo(() => {
    return post.postMedia[0]; // TODO: Use isFreePreview?
  }, [post.postMedia]);

  const videoLengthMs = (relevantMedia?.media?.duration || 0) * 1000;

  if (graphData.length <= 1) {
    return null;
  }

  const latestData = graphData[graphData.length - 1];
  const secondsFormatter = (value: number) => `${formatToDecimalSeconds(value * 1000)}`;

  return (
    <div className="mt-8 bg-gray-50 dark:bg-gray-900 rounded-lg p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm">Total Views</span>
          <span className="text-2xl font-bold">{formatNumber(latestData.Views)}</span>
        </div>
        <div>
          <span className="text-sm">Average Watch Time</span>
          <div className="flex items-baseline mt-1 gap-3">
            <span className="text-2xl font-bold">
              {secondsFormatter(latestData.averageWatchTimeSeconds)}
            </span>
            <span className="text-sm">/ {formatToDecimalSeconds(videoLengthMs)}</span>
            <span>{latestData.averageWatchTimePercent}%</span>
          </div>
        </div>
        <CategoryBar
          values={[2.5, 0.5, 1, 1, 3, 2]}
          colors={["gray", "red", "amber", "emerald", "violet"]}
          marker={{
            value: latestData.averageWatchTimeSeconds,
            showAnimation: true,
          }}
        />
      </div>
    </div>
  );
};
