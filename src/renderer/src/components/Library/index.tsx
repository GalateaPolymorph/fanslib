import { MediaFilters } from "../../../../features/library/api-type";
import { FilterPresetProvider } from "../../contexts/FilterPresetContext";
import { useLibrary } from "../../contexts/LibraryContext";
import { useLibraryPreferences } from "../../contexts/LibraryPreferencesContext";
import { useSettings } from "../../contexts/SettingsContext";
import { Gallery } from "../../pages/Manage/Gallery/Gallery";
import { GalleryPagination } from "../../pages/Manage/Gallery/GalleryPagination";
import { GalleryViewSettings } from "../../pages/Manage/Gallery/GalleryViewSettings";
import { LibrarySortOptions } from "../../pages/Manage/Gallery/LibrarySortOptions";
import { FilterActions } from "../MediaFilters/FilterActions";
import { MediaFilters as MediaFiltersComponent } from "../MediaFilters/MediaFilters";
import { MediaFiltersProvider } from "../MediaFilters/MediaFiltersContext";
import { ScanButton } from "./Scan/ScanButton";
import { ScanProgress } from "./Scan/ScanProgress";
import { useScan } from "./Scan/useScan";

export type LibraryProps = {
  showHeader?: boolean;
};

export const Library = ({ showHeader = true }: LibraryProps) => {
  const { settings } = useSettings();
  const { media, error, totalPages, totalItems } = useLibrary();
  const { preferences, updatePreferences } = useLibraryPreferences();

  const { isScanning, scanProgress, handleScan, scanResult } = useScan();
  if (!settings?.libraryPath) {
    return null;
  }

  const updateFilters = (filters: MediaFilters) => {
    console.log("updateFilters", filters);
    updatePreferences({
      filter: filters,
      pagination: { page: 1 },
    });
  };

  return (
    <FilterPresetProvider onFiltersChange={updateFilters}>
      <MediaFiltersProvider value={preferences.filter} onChange={updateFilters}>
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
                <MediaFiltersComponent />
                <div className="flex items-center gap-2">
                  <FilterActions />
                  <GalleryViewSettings />
                  <LibrarySortOptions
                    value={preferences.sort}
                    onChange={(sort) => {
                      updatePreferences({
                        sort,
                        pagination: { page: 1 },
                      });
                    }}
                  />
                </div>
              </div>
            </div>

            <ScanProgress scanProgress={scanProgress} scanResult={scanResult} />

            <div className="flex-1 min-h-0 overflow-auto">
              <Gallery
                medias={media}
                error={error}
                libraryPath={settings?.libraryPath}
                onScan={handleScan}
              />
            </div>
            <GalleryPagination totalPages={totalPages} totalItems={totalItems} />
          </div>
        </div>
      </MediaFiltersProvider>
    </FilterPresetProvider>
  );
};
