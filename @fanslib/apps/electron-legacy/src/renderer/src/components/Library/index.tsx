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
import { PageContainer } from "../ui/PageContainer/PageContainer";
import { PageHeader } from "../ui/PageHeader/PageHeader";
import { SectionHeader } from "../ui/SectionHeader/SectionHeader";
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
        <PageContainer padding="none" className="h-full w-full overflow-hidden flex flex-col">
          {showHeader && (
            <PageHeader
              title="Library"
              description="Browse and manage your media collection"
              actions={<ScanButton isScanning={isScanning} onScan={handleScan} />}
              className="py-6 px-6 flex-none"
            />
          )}
          <div className="flex-1 min-h-0 p-6 flex flex-col">
            <SectionHeader
              title=""
              spacing="default"
              actions={
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
              }
            />
            <div className="mb-4">
              <MediaFiltersComponent />
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
        </PageContainer>
      </MediaFiltersProvider>
    </FilterPresetProvider>
  );
};
