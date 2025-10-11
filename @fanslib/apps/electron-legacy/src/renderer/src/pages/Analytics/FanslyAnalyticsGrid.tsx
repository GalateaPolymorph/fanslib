import { MediaSelectionProvider } from "@renderer/contexts/MediaSelectionContext";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowUpDown, Download, Grid3X3, List } from "lucide-react";
import { useState } from "react";
import { AnalyticsPostTile } from "../../components/Analytics/AnalyticsPostTile";
import { Button } from "../../components/ui/Button";
import { useAnalytics } from "../../contexts/AnalyticsContext";
import { cn } from "../../lib/utils";

type SortConfig = {
  sortBy: string;
  sortDirection: "asc" | "desc";
};

type ViewMode = "list" | "grid";

export const FanslyAnalyticsGrid = () => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    sortBy: "date",
    sortDirection: "desc",
  });
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const { timeframe } = useAnalytics();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["fanslyPosts", sortConfig, timeframe],
    queryFn: () =>
      window.api["analytics:getFanslyPostsWithAnalytics"](
        sortConfig.sortBy,
        sortConfig.sortDirection,
        timeframe.startDate.toISOString(),
        timeframe.endDate.toISOString()
      ),
  });

  const exportToCsv = () => {
    const headers = [
      "Date",
      "Caption",
      "Post URL",
      "Statistics URL",
      "Views",
      "Avg. Engagement (s)",
      "Engagement %",
      "Video Length (s)",
      "Hashtags",
    ];
    const csvData = posts.map((post) => [
      format(new Date(post.date), "yyyy-MM-dd"),
      post.caption,
      post.postUrl || "N/A",
      post.statisticsUrl || "N/A",
      post.totalViews,
      post.averageEngagementSeconds.toFixed(1),
      post.averageEngagementPercent.toFixed(1),
      post.videoLength,
      post.hashtags.join(", "),
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `fansly-analytics-${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSort = (field: string) => {
    setSortConfig({
      sortBy: field,
      sortDirection:
        sortConfig.sortBy === field && sortConfig.sortDirection === "asc" ? "desc" : "asc",
    });
  };

  const getSortIcon = (field: string) => {
    if (sortConfig.sortBy !== field) return null;
    return <ArrowUpDown className="ml-1 h-4 w-4" />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">No posts found for the selected timeframe.</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{posts.length} posts found</span>
        </div>
        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-r-none"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-l-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>

          {/* Sort controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSort("date")}
              className="text-xs"
            >
              Date
              {getSortIcon("date")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSort("views")}
              className="text-xs"
            >
              Views
              {getSortIcon("views")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSort("engagement")}
              className="text-xs"
            >
              Engagement
              {getSortIcon("engagement")}
            </Button>
          </div>

          {/* Export button */}
          <Button onClick={exportToCsv} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Posts display */}
      <div
        className={cn(
          viewMode === "list" ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        )}
      >
        <MediaSelectionProvider media={[]}>
          {posts.map((post) => (
            <AnalyticsPostTile
              key={post.id}
              post={post}
              className={viewMode === "grid" ? "h-full" : ""}
            />
          ))}
        </MediaSelectionProvider>
      </div>
    </div>
  );
};
