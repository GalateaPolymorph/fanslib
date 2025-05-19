import { Button } from "@renderer/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@renderer/components/ui/card";
import { Input } from "@renderer/components/ui/input";
import { useState } from "react";
import { Post } from "../../../../features/posts/entity";
import {
  formatNumber,
  formatToDecimalSeconds,
  parseAnalyticsResponse,
} from "../../../../lib/fansly-analytics";
import { calculateFanslyPostAnalytics } from "../../../../lib/fansly-analytics/fansly-post-analytics";

type PostDetailAnalyticsProps = {
  post: Post;
};

export const PostDetailAnalytics = ({ post }: PostDetailAnalyticsProps) => {
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");

  if (post.channel.typeId !== "fansly") {
    return null;
  }

  const saveAnalytics = async () => {
    setError(null);
    const data = parseAnalyticsResponse(inputValue);
    if (!data) {
      setError("Invalid analytics data format");
      return;
    }

    if (data.response.dataset.period !== 86400000) {
      setError("Only 'Last 30 days' analytics are supported for now.");
      return;
    }

    try {
      await window.api["analytics:addDatapointsToPost"](post.id, data);
      setInputValue("");
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save analytics data");
    }
  };

  const analytics = calculateFanslyPostAnalytics(post);

  return (
    <div className="w-full space-y-4">
      <h2 className="text-lg font-semibold tracking-tight">Analytics</h2>
      <div className="flex gap-2">
        <Input
          placeholder="Paste Fansly API response JSON here..."
          className="font-mono text-sm"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button onClick={saveAnalytics}>Save Datapoints</Button>
      </div>
      {error && <div className="text-sm text-destructive">{error}</div>}
      <div className="flex gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Post Date: </span>
          <span className="font-medium">{analytics.postDate.toLocaleDateString()}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Video Length: </span>
          <span className="font-medium">{formatToDecimalSeconds(analytics.videoLengthMs)}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {analytics.fypStats.map((stat) => (
          <Card key={stat.period}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                {stat.period === "day1"
                  ? "24 Hours"
                  : stat.period === "day7"
                    ? "7 Days"
                    : stat.period === "day14"
                      ? "14 Days"
                      : stat.period === "day30"
                        ? "30 Days"
                        : "All Time"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {stat.hasData ? (
                <>
                  <div>
                    <div className="text-sm text-muted-foreground">Views</div>
                    <div className="text-xl font-bold">{formatNumber(stat.views)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Avg. Watch Time</div>
                    <div className="text-xl font-bold">
                      {formatToDecimalSeconds(stat.averageInteractionTimeMs)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Watch %</div>
                    <div className="text-xl font-bold">{stat.averageInteractionPercent}%</div>
                  </div>
                </>
              ) : (
                <div className="text-sm text-muted-foreground">No data available</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
