import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { BulkFetchButton } from "../../components/analytics/BulkFetchButton";
import { BulkAnalyticsFetchProgress } from "../../components/analytics/BulkFetchProgress";
import { KpiOverviewCards } from "../../components/analytics/KpiOverviewCards";
import { TimeframeSelector } from "../../components/analytics/TimeframeSelector";
import { EngagementViewsChart } from "../../components/analytics/charts/EngagementViewsChart";
import { HashtagPerformanceHeatmap } from "../../components/analytics/charts/HashtagPerformanceHeatmap";
import { OptimalLengthChart } from "../../components/analytics/charts/OptimalLengthChart";
import { TimePerformanceHeatmap } from "../../components/analytics/charts/TimePerformanceHeatmap";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
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
          {/* KPI Cards */}
          <KpiOverviewCards />

          {/* Existing Analytics Grid */}
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
            {/* Engagement vs Views Scatter Plot */}
            <EngagementViewsChart />

            {/* Grid layout for remaining charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <OptimalLengthChart />
              <HashtagPerformanceHeatmap />
            </div>

            {/* Full width for time heatmap */}
            <TimePerformanceHeatmap />
          </div>
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Actionable Insights</CardTitle>
              <CardDescription>Recommendations to improve your content performance</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Insights will go here */}
              <p>Insights coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
