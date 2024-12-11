import { WelcomeScreen } from "../../components/WelcomeScreen";
import { Button } from "../../components/ui/button";
import { useSettings } from "../../contexts/SettingsContext";
import { useLibrary } from "../../hooks/useLibrary";
import { useLibraryPreferences } from "../../hooks/useLibraryPreferences";
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

  const handlePageChange = (newPage: number) => {
    updatePreferences({ page: newPage });
  };

  const handleScan = async () => {
    try {
      await window.api["library:scan"]();
      await refetch();
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
      <h1 className="text-2xl font-bold py-6 pl-6 flex-none">Library</h1>
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
