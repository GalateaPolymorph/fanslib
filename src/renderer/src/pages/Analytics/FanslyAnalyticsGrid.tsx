import { MediaSelectionProvider } from "@renderer/contexts/MediaSelectionContext";
import { ArrowUpDown, Grid3X3, List } from "lucide-react";
import { useState } from "react";
import { AnalyticsPostTile } from "../../components/Analytics/AnalyticsPostTile";
import { Button } from "../../components/ui/Button";
import { useAnalytics } from "../../contexts/AnalyticsContext";
import { cn } from "../../lib/utils";

type ViewMode = "list" | "grid";

export const FanslyAnalyticsGrid = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const { posts, isLoading, sortConfig, setSortConfig } = useAnalytics();

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
