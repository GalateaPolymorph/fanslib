import { Download, MoreHorizontal, Search } from "lucide-react";
import { Button } from "../../components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/DropdownMenu";
import { useAnalytics } from "../../contexts/AnalyticsContext";
import { useCsvExport } from "../../hooks/analytics/useCsvExport";
import { useDiscoverFanslyPosts } from "../../hooks/analytics/useDiscoverFanslyPosts";

export const FanslyAnalyticsDashboardActions = () => {
  const { posts } = useAnalytics();
  const { exportToCsv } = useCsvExport();
  const discoverPostsMutation = useDiscoverFanslyPosts();

  const handleExportCsv = () => {
    exportToCsv(posts);
  };

  const handleDiscoverPosts = () => {
    const payload = {
      headless: false,
      maxPosts: 100,
      daysBack: 30,
    };

    discoverPostsMutation.mutate(payload);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleDiscoverPosts} disabled={discoverPostsMutation.isPending}>
          <Search className="mr-2 h-4 w-4" />
          {discoverPostsMutation.isPending ? "Discovering..." : "Discover Post URLs"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportCsv}>
          <Download className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
