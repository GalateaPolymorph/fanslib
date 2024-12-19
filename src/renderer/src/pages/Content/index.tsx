import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { LibraryScanProgress, LibraryScanResult } from "../../../../features/library/api-type";
import { LibraryFilters } from "../../components/LibraryFilters";
import { WelcomeScreen } from "../../components/WelcomeScreen";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import {
  LibraryPreferencesProvider,
  useLibraryPreferences,
} from "../../contexts/LibraryPreferencesContext";
import { useSettings } from "../../contexts/SettingsContext";
import { useLibrary } from "../../hooks/useLibrary";
import { cn } from "../../lib/utils";
import { Gallery } from "./Gallery";
import { GalleryPagination } from "./GalleryPagination";
import { LibrarySortOptions } from "./LibrarySortOptions";

const ContentPageContent = () => {
  const { settings, loading } = useSettings();
  const {
    preferences,
    updateFilterPreferences,
    updatePaginationPreferences,
    updateSortPreferences,
  } = useLibraryPreferences();
  const { media, totalItems, totalPages, error, refetch } = useLibrary(preferences);

  const [scanProgress, setScanProgress] = useState<LibraryScanProgress | null>(null);
  const [scanResult, setScanResult] = useState<LibraryScanResult | null>(null);

  useEffect(() => {
    window.api["library:onScanProgress"]((_event, progress) => {
      setScanProgress(progress);
    });

    window.api["library:onScanComplete"]((_event, result) => {
      setScanProgress(null);
      setScanResult(result);
      refetch();
    });
  }, []);

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
                search: preferences.filter.search,
                categories: preferences.filter.categories,
                unposted: preferences.filter.unposted,
              }}
              onFilterChange={(filters) => {
                updateFilterPreferences(filters);
                updatePaginationPreferences({ page: 1 });
              }}
            />
            <div className="flex items-center gap-2">
              <LibrarySortOptions
                value={preferences.sort}
                onChange={(sort) => {
                  updateSortPreferences(sort);
                  updatePaginationPreferences({
                    page: 1,
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
            error={error}
            libraryPath={settings?.libraryPath}
            onScan={handleScan}
            onUpdate={() => void refetch()}
          />
        </div>
        <GalleryPagination totalPages={totalPages} totalItems={totalItems} />
      </div>
    </div>
  );
};

export const ContentPage = () => {
  return (
    <LibraryPreferencesProvider>
      <ContentPageContent />
    </LibraryPreferencesProvider>
  );
};
