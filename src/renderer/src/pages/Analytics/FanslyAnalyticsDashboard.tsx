import { Tabs, TabsContent, TabsList, TabsTrigger } from "@renderer/components/ui/tabs";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { BulkFetchButton } from "../../components/Analytics/BulkFetchButton";
import { BulkAnalyticsFetchProgress } from "../../components/Analytics/BulkFetchProgress";
import { KpiOverviewCards } from "../../components/Analytics/KpiOverviewCards";
import { TimeframeSelector } from "../../components/Analytics/TimeframeSelector";
import { EngagementViewsChart } from "../../components/Analytics/charts/EngagementViewsChart";
import { HashtagPerformanceHeatmap } from "../../components/Analytics/charts/HashtagPerformanceHeatmap";
import { OptimalLengthChart } from "../../components/Analytics/charts/OptimalLengthChart";
import { TimePerformanceHeatmap } from "../../components/Analytics/charts/TimePerformanceHeatmap";
import { InsightsPanel } from "../../components/Analytics/insights/InsightsPanel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useBulkFetch } from "../../hooks/analytics/useBulkFetch";
import { FanslyAnalyticsGrid } from "./FanslyAnalyticsGrid";

export const FanslyAnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const queryClient = useQueryClient();

  const { fetchProgress, fetchResult, isFetching, startBulkFetch } = useBulkFetch(() => {
    // Invalidate queries to refresh data after bulk fetch
    queryClient.invalidateQueries({ queryKey: ["fanslyPosts"] });
    queryClient.invalidateQueries({ queryKey: ["analyticsSummary"] });
    queryClient.invalidateQueries({ queryKey: ["hashtagAnalytics"] });
    queryClient.invalidateQueries({ queryKey: ["timeAnalytics"] });
    queryClient.invalidateQueries({ queryKey: ["insights"] });
  });

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Fansly Analytics Dashboard</h1>
        <div className="flex items-center gap-3">
          <BulkFetchButton isFetching={isFetching} onStartFetch={startBulkFetch} />
          <TimeframeSelector />
        </div>
      </div>

      <BulkAnalyticsFetchProgress fetchProgress={fetchProgress} fetchResult={fetchResult} />

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="visualizations">Visualizations</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <KpiOverviewCards />
          <Card>
            <CardHeader>
              <CardTitle>Post Analytics</CardTitle>
              <CardDescription>Detailed analytics for each post</CardDescription>
            </CardHeader>
            <CardContent>
              <FanslyAnalyticsGrid />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visualizations" className="mt-6">
          <div className="grid gap-6">
            <EngagementViewsChart />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <OptimalLengthChart />
              <HashtagPerformanceHeatmap />
            </div>

            <TimePerformanceHeatmap />
          </div>
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          <InsightsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};
