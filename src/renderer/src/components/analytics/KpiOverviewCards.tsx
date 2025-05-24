import { useQuery } from "@tanstack/react-query";
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useAnalytics } from "../../contexts/AnalyticsContext";
import { MediaTileLite } from "../MediaTile/MediaTileLite";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Skeleton } from "../ui/skeleton";

// Helper function to format numbers with k/m suffixes
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "m";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
};

export const KpiOverviewCards = () => {
  const { timeframe } = useAnalytics();

  // Fetch analytics summary with the selected timeframe
  const { data: summary, isLoading } = useQuery({
    queryKey: ["analyticsSummary", timeframe],
    queryFn: async () =>
      window.api["analytics:getAnalyticsSummary"]({
        startDate: timeframe.startDate.toISOString(),
        endDate: timeframe.endDate.toISOString(),
      }),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Total Views Card (previously Average Engagement Card) */}
      <Card>
        <CardHeader className="pb-0"></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Average Engagement */}
            <div>
              <div className="text-sm text-muted-foreground mb-1">Average Engagement</div>
              <div className="text-3xl font-bold">
                {summary?.averageEngagementPercent ?? 0}
                <span className="text-base text-muted-foreground">%</span>
              </div>
              <div className="flex items-center text-sm mt-1">
                {(summary?.engagementTrend ?? 0) > 0 ? (
                  <>
                    <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-500">+{summary?.engagementTrend ?? 0}%</span>
                  </>
                ) : (summary?.engagementTrend ?? 0) < 0 ? (
                  <>
                    <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                    <span className="text-red-500">{summary?.engagementTrend ?? 0}%</span>
                  </>
                ) : (
                  <>
                    <ArrowRightIcon className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-yellow-500">0%</span>
                  </>
                )}
              </div>
              <div className="mt-2">
                <Progress
                  value={summary?.averageEngagementPercent ?? 0}
                  max={100}
                  className="h-2"
                />
              </div>
            </div>

            {/* Total Views */}
            <div className="mt-6">
              <div className="text-sm text-muted-foreground mb-1">Total Views</div>
              <div className="text-3xl font-bold">{formatNumber(summary?.totalViews ?? 0)}</div>
              <div className="flex items-center text-sm mt-1">
                {(summary?.viewsTrend ?? 0) > 0 ? (
                  <>
                    <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-500">+{summary?.viewsTrend ?? 0}%</span>
                  </>
                ) : (summary?.viewsTrend ?? 0) < 0 ? (
                  <>
                    <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                    <span className="text-red-500">{summary?.viewsTrend ?? 0}%</span>
                  </>
                ) : (
                  <>
                    <ArrowRightIcon className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-yellow-500">0%</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Performers by Engagement Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Top Performers</CardDescription>
          <CardTitle>Most Engaging Content</CardTitle>
        </CardHeader>
        <CardContent>
          {summary?.topPerformers && summary.topPerformers.length > 0 ? (
            <div className="space-y-4">
              {summary.topPerformers.slice(0, 3).map((performer) => {
                // Only attempt to access post if it exists
                const post = performer.post;
                const firstMedia = post?.postMedia?.[0]?.media;

                return (
                  <Link
                    to={`/posts/${post?.id ?? performer.id}`}
                    key={performer.id}
                    className="flex gap-3 items-center hover:bg-accent p-2 rounded-md transition-colors"
                  >
                    {firstMedia && (
                      <div className="flex-shrink-0 w-16 h-16">
                        <MediaTileLite media={firstMedia} />
                      </div>
                    )}

                    <div className="flex-grow min-w-0">
                      <div className="font-medium truncate">{performer.caption}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatNumber(performer.views)} views
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-lg font-bold">{performer.engagement}s</div>
                      <div className="text-xs text-muted-foreground">avg. engagement</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No top performers to display
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Performers by Views Card (Replacing Engagement-to-Views) */}
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Top Performers</CardDescription>
          <CardTitle>Most Viewed Content</CardTitle>
        </CardHeader>
        <CardContent>
          {summary?.topPerformersByViews && summary.topPerformersByViews.length > 0 ? (
            <div className="space-y-4">
              {summary.topPerformersByViews.slice(0, 3).map((performer) => {
                // Only attempt to access post if it exists
                const post = performer.post;
                const firstMedia = post?.postMedia?.[0]?.media;

                return (
                  <Link
                    to={`/posts/${post?.id ?? performer.id}`}
                    key={performer.id}
                    className="flex gap-3 items-center hover:bg-accent p-2 rounded-md transition-colors"
                  >
                    {firstMedia && (
                      <div className="flex-shrink-0 w-16 h-16">
                        <MediaTileLite media={firstMedia} />
                      </div>
                    )}

                    <div className="flex-grow min-w-0">
                      <div className="font-medium truncate">{performer.caption}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatNumber(performer.views)} views
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-lg font-bold">{formatNumber(performer.views)}</div>
                      <div className="text-xs text-muted-foreground">total views</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No top performers to display
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
