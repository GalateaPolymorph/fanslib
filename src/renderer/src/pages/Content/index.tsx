import { useRef } from "react";
import * as ResizablePrimitive from "react-resizable-panels";
import { LibraryFilters } from "../../components/LibraryFilters";
import { WelcomeScreen } from "../../components/WelcomeScreen";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../../components/ui/resizable";
import { useLibrary } from "../../contexts/LibraryContext";
import { useLibraryPreferences } from "../../contexts/LibraryPreferencesContext";
import { MediaDragProvider } from "../../contexts/MediaDragContext";
import { useSettings } from "../../contexts/SettingsContext";
import { Gallery } from "./Gallery/Gallery";
import { GalleryPagination } from "./Gallery/GalleryPagination";
import { GalleryViewSettings } from "./Gallery/GalleryViewSettings";
import { LibrarySortOptions } from "./Gallery/LibrarySortOptions";
import { ScanButton } from "./Scan/ScanButton";
import { ScanProgress } from "./Scan/ScanProgress";
import { useScan } from "./Scan/useScan";
import { Shoots } from "./Shoots/Shoots";

export const ContentPage = () => {
  const { settings, loading } = useSettings();
  const {
    preferences,
    updateFilterPreferences,
    updatePaginationPreferences,
    updateSortPreferences,
  } = useLibraryPreferences();
  const { media, totalItems, totalPages, error, refetch } = useLibrary();
  const { scanProgress, scanResult, isScanning, handleScan } = useScan(refetch);
  const panelGroupRef = useRef<ResizablePrimitive.ImperativePanelGroupHandle>(null);

  if (loading) {
    return null;
  }

  if (!settings?.libraryPath) {
    return <WelcomeScreen />;
  }

  return (
    <div className="h-full w-full overflow-hidden">
      <MediaDragProvider>
        <ResizablePanelGroup direction="horizontal" ref={panelGroupRef}>
          <ResizablePanel defaultSize={70} minSize={30} panelIndex={0} groupRef={panelGroupRef}>
            <div className="h-full w-full overflow-hidden flex flex-col">
              <div className="flex justify-between items-center py-6 px-6 flex-none">
                <h1 className="text-2xl font-bold">Library</h1>
                <ScanButton isScanning={isScanning} onScan={handleScan} />
              </div>
              <div className="flex-1 min-h-0 p-6 flex flex-col">
                <div className="flex justify-between items-center mb-4 flex-none">
                  <div className="flex items-center w-full justify-between gap-4">
                    <LibraryFilters
                      value={{
                        search: preferences.filter.search,
                        categories: preferences.filter.categories,
                        unposted: preferences.filter.unposted,
                        excludeShoots: preferences.filter.excludeShoots,
                      }}
                      onFilterChange={(filters) => {
                        console.log("filters", filters);
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
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel
            defaultSize={40}
            minSize={3}
            maxSize={40}
            collapsible
            headerSlot={<h1 className="text-2xl font-bold">Shoots</h1>}
            panelIndex={1}
            groupRef={panelGroupRef}
          >
            <Shoots />
          </ResizablePanel>
        </ResizablePanelGroup>
      </MediaDragProvider>
    </div>
  );
};
