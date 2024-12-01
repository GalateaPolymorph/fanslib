import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { PanelGroup } from "react-resizable-panels";
import { WelcomeScreen } from "../../components/WelcomeScreen";
import { ResizableHandle, ResizablePanel } from "../../components/ui/resizable";
import { useSettings } from "../../contexts/SettingsContext";
import { useLibrary } from "../../hooks/useLibrary";
import { Gallery, GridSizeContext, GridSizeToggle, type GridSize } from "./Gallery";
import { LibraryFilters } from "./LibraryFilters";
import { MediaDetail } from "./MediaDetail";

export const ContentPage = () => {
  const { settings, loading } = useSettings();
  const [filters, setFilters] = useState<{ isNew?: boolean; categories?: string[] }>({});
  const { media, scanning, error } = useLibrary(settings?.libraryPath ?? "", filters);
  const [selectedMedia, setSelectedMedia] = useState<(typeof media)[number] | null>(null);
  const [gridSize, setGridSize] = useState<GridSize>("large");

  if (loading) {
    return null;
  }

  if (!settings?.libraryPath) {
    return <WelcomeScreen />;
  }

  return (
    <div className="h-full w-full overflow-hidden">
      <PanelGroup direction="horizontal" className="h-full w-full">
        <ResizablePanel id="gallery" defaultSize={50} minSize={30} className="flex flex-col h-full">
          <h1 className="text-2xl font-bold py-6 pl-6 flex-none">Library</h1>
          <div className="flex-1 overflow-hidden">
            <div className="h-full p-6">
              <GridSizeContext.Provider value={{ gridSize, setGridSize }}>
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center mb-4 flex-none">
                    <LibraryFilters onFilterChange={setFilters} />
                    <GridSizeToggle />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <Gallery
                      media={media}
                      scanning={scanning}
                      error={error ?? undefined}
                      onMediaSelect={setSelectedMedia}
                    />
                  </div>
                </div>
              </GridSizeContext.Provider>
            </div>
          </div>
        </ResizablePanel>
        <AnimatePresence mode="sync">
          {selectedMedia && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel id="detail" defaultSize={50} minSize={20} maxSize={50}>
                <MediaDetail media={selectedMedia} onClose={() => setSelectedMedia(null)} />
              </ResizablePanel>
            </>
          )}
        </AnimatePresence>
      </PanelGroup>
    </div>
  );
};
