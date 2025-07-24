import { AreaChart } from "@renderer/components/tremor/AreaChart";
import { Post } from "../../../../features/posts/entity";
import { formatNumber, aggregatePostAnalyticsData } from "../../../../lib/fansly-analytics";
import { useMemo } from "react";

type PostAnalyticsGraphProps = {
  post: Post;
};

export const PostAnalyticsGraph = ({ post }: PostAnalyticsGraphProps) => {
  const graphData = useMemo(() => aggregatePostAnalyticsData(post, false), [post]);

  if (graphData.length <= 1) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground">
        Not enough data points to display graph
      </div>
    );
  }

  return (
    <div>
      <div className="mt-12">
        <div className="relative" style={{ minHeight: "300px" }}>
          <AreaChart
            className="h-72 mt-2"
            data={graphData}
            index="date"
            categories={["Views"]}
            colors={["blue"]}
            valueFormatter={formatNumber}
            showLegend={false}
            tickGap={1}
            showXAxis={true}
            showYAxis={true}
            showGridLines={true}
            yAxisWidth={60}
            connectNulls={true}
          />

          {graphData.some((point) => point.daysSincePost >= 7) && (
            <div
              className="absolute border-l-2 border-dashed border-amber-500 h-[calc(100%-45px)] top-0"
              style={{
                left: `${Math.min(
                  95,
                  (graphData.findIndex((p) => p.daysSincePost >= 7) / (graphData.length - 1)) * 100
                )}%`,
                pointerEvents: "none",
              }}
            >
              <div className="absolute -top-6 -translate-x-1/2 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded text-xs text-amber-600 font-medium">
                7 days
              </div>
            </div>
          )}

          {graphData.some((point) => point.daysSincePost >= 30) && (
            <div
              className="absolute border-l-2 border-dashed border-green-500 h-[calc(100%-45px)] top-0"
              style={{
                left: `${Math.min(
                  95,
                  (graphData.findIndex((p) => p.daysSincePost >= 30) / (graphData.length - 1)) *
                    100 +
                    1
                )}%`,
                pointerEvents: "none",
              }}
            >
              <div className="absolute -top-6 -translate-x-1/2 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded text-xs text-green-600 font-medium">
                30 days
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
