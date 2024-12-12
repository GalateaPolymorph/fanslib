import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { LibraryScanProgress, LibraryScanResult } from "../../../../features/library/api-type";
import { WelcomeScreen } from "../../components/WelcomeScreen";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { useSettings } from "../../contexts/SettingsContext";
import { useLibrary } from "../../hooks/useLibrary";
import { useLibraryPreferences } from "../../hooks/useLibraryPreferences";
import { cn } from "../../lib/utils";
import { Gallery } from "./Gallery";
import { LibraryFilters } from "./LibraryFilters";
import { LibrarySortOptions } from "./LibrarySortOptions";

export const ContentPage = () => {
  const { settings, loading } = useSettings();
  const { preferences, updatePreferences } = useLibraryPreferences();
  const { media, totalItems, currentPage, totalPages, error, refetch } = useLibrary({
    categories: undefined,
    unposted: undefined,
    sort: undefined,
    page: 1,
    limit: 20,
  });

  const [scanProgress, setScanProgress] = useState<LibraryScanProgress | null>(null);
  const [scanResult, setScanResult] = useState<LibraryScanResult | null>(null);

  useEffect(() => {
    window.api["library:onScanProgress"]((_event, progress) => {
      console.log("Scan progress:", progress);
      setScanProgress(progress);
    });

    window.api["library:onScanComplete"]((_event, result) => {
      setScanProgress(null);
      setScanResult(result);
      refetch();
    });
  }, []);

  const handlePageChange = (newPage: number) => {
    updatePreferences({ page: newPage });
  };

  const handleScan = async () => {
    setScanProgress(null);
    setScanResult(null);
    try {
      await window.api["library:scan"]();
    } catch (error) {
      console.error("Failed to scan library:", error);
    }
  };

  if (loading) {
    return null;
  }

  if (!settings?.libraryPath) {
    return <WelcomeScreen />;
  }

  return (
    <div className="h-full w-full overflow-hidden flex flex-col">
      <div className="flex justify-between items-center py-6 px-6 flex-none">
        <h1 className="text-2xl font-bold">Library</h1>
        <Button
          variant="outline"
          onClick={handleScan}
          disabled={scanProgress !== null}
          className="flex items-center gap-2"
        >
          <RefreshCw className={cn("h-4 w-4", scanProgress && "animate-spin")} />
          {scanProgress ? `Scanning...` : "Scan Library"}
        </Button>
      </div>
      <div className="flex-1 min-h-0 p-6 flex flex-col">
        <div className="flex justify-between items-center mb-4 flex-none">
          <div className="flex items-center w-full justify-between gap-4">
            <LibraryFilters
              value={{
                categories: preferences.categories,
                unposted: preferences.unposted,
              }}
              onFilterChange={(newFilters) => {
                updatePreferences({
                  ...newFilters,
                  page: 1, // Reset to first page when filters change
                });
              }}
            />
            <div className="flex items-center gap-2">
              <LibrarySortOptions
                value={preferences.sort}
                onChange={(sort) => {
                  updatePreferences({
                    sort,
                    page: 1, // Reset to first page when sort changes
                  });
                }}
              />
            </div>
          </div>
        </div>

        {scanProgress && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Scanning library...</span>
              <span>{Math.round((scanProgress.current / scanProgress.total) * 100)}%</span>
            </div>
            <Progress value={(scanProgress.current / scanProgress.total) * 100} />
          </div>
        )}

        {scanResult && (
          <div className="mb-4 text-sm text-muted-foreground">
            Scan complete: {scanResult.added} added, {scanResult.updated} updated,{" "}
            {scanResult.removed} removed
          </div>
        )}

        <div className="flex-1 min-h-0 overflow-auto">
          <Gallery
            media={media}
            error={error ?? undefined}
            libraryPath={settings?.libraryPath}
            onScan={handleScan}
            gridSize={preferences.gridSize}
          />
        </div>
        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4 pt-4 flex-none">
          <div className="text-sm text-muted-foreground">
            {totalItems} items • Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
