import { useLibrary } from "../../contexts/LibraryContext";
import { useLibraryPreferences } from "../../contexts/LibraryPreferencesContext";
import { useSettings } from "../../contexts/SettingsContext";
import { Gallery } from "../../pages/Content/Gallery/Gallery";
import { GalleryPagination } from "../../pages/Content/Gallery/GalleryPagination";
import { GalleryViewSettings } from "../../pages/Content/Gallery/GalleryViewSettings";
import { LibrarySortOptions } from "../../pages/Content/Gallery/LibrarySortOptions";
import { LibraryFilters } from "../LibraryFilters";
import { ScanButton } from "./Scan/ScanButton";
import { ScanProgress } from "./Scan/ScanProgress";
import { useScan } from "./Scan/useScan";

export type LibraryProps = {
  showHeader?: boolean;
};

export const Library = ({ showHeader = true }: LibraryProps) => {
  const { settings } = useSettings();
  const { media, error, refetch, totalPages, totalItems } = useLibrary();
  const {
    preferences,
    updateFilterPreferences,
    updatePaginationPreferences,
    updateSortPreferences,
  } = useLibraryPreferences();

  const { isScanning, scanProgress, handleScan, scanResult } = useScan();
  if (!settings?.libraryPath) {
    return null;
  }

  return (
    <div className="h-full w-full overflow-hidden flex flex-col">
      {showHeader && (
        <div className="flex justify-between items-center py-6 px-6 flex-none">
          <h1 className="text-2xl font-bold">Library</h1>
          <ScanButton isScanning={isScanning} onScan={handleScan} />
        </div>
      )}
      <div className="flex-1 min-h-0 p-6 flex flex-col">
        <div className="flex justify-between items-center mb-4 flex-none">
          <div className="flex items-center w-full justify-between gap-4">
            <LibraryFilters
              value={{
                search: preferences.filter.search,
                categories: preferences.filter.categories,
                excludeShoots: preferences.filter.excludeShoots,
                channelFilters: preferences.filter.channelFilters,
              }}
              onFilterChange={(filters) => {
                updateFilterPreferences(filters);
                updatePaginationPreferences({ page: 1 });
              }}
            />
            <div className="flex items-center gap-2">
              <GalleryViewSettings />
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

        <ScanProgress scanProgress={scanProgress} scanResult={scanResult} />

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
