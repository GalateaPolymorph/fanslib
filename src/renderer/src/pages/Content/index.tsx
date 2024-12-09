import { useState } from "react";
import { WelcomeScreen } from "../../components/WelcomeScreen";
import { Button } from "../../components/ui/button";
import { useSettings } from "../../contexts/SettingsContext";
import { useLibrary } from "../../hooks/useLibrary";
import { Gallery, GridSizeContext, GridSizeToggle, type GridSize } from "./Gallery";
import { LibraryFilters } from "./LibraryFilters";

export const ContentPage = () => {
  const { settings, loading } = useSettings();
  const [gridSize, setGridSize] = useState<GridSize>("large");
  const [filters, setFilters] = useState<{
    categories?: string[];
    page?: number;
    limit?: number;
  }>({
    page: 1,
    limit: 50,
  });
  const { media, totalItems, currentPage, totalPages, error, refetch } = useLibrary(filters);

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
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
        <GridSizeContext.Provider value={{ gridSize, setGridSize }}>
          <div className="flex justify-between items-center mb-4 flex-none">
            <LibraryFilters onFilterChange={setFilters} />
            <GridSizeToggle />
          </div>
          <div className="flex-1 min-h-0 overflow-auto">
            <Gallery
              media={media}
              error={error ?? undefined}
              libraryPath={settings?.libraryPath}
              onScan={handleScan}
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
        </GridSizeContext.Provider>
      </div>
    </div>
  );
};
