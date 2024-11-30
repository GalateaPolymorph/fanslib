import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { PanelGroup } from "react-resizable-panels";
import { Gallery, GridSizeContext, GridSizeToggle, type GridSize } from "../components/Gallery";
import { LibraryFilters } from "../components/LibraryFilters";
import { MediaDetail } from "../components/MediaDetail";
import { WelcomeScreen } from "../components/WelcomeScreen";
import { ResizableHandle, ResizablePanel } from "../components/ui/resizable";
import { useSettings } from "../contexts/SettingsContext";
import { useLibrary } from "../hooks/useLibrary";

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
    <div className="h-full w-full">
      <PanelGroup direction="horizontal" className="w-full">
        <ResizablePanel defaultSize={50} minSize={30} className="flex flex-col">
          <h1 className="text-2xl font-bold py-6 pl-6">Library</h1>
          <div className="container mx-auto">
            <div className="flex flex-col p-6">
              <GridSizeContext.Provider value={{ gridSize, setGridSize }}>
                <div className="flex justify-between items-center mb-4">
                  <LibraryFilters onFilterChange={setFilters} />
                  <GridSizeToggle />
                </div>
                <Gallery
                  media={media}
                  scanning={scanning}
                  error={error ?? undefined}
                  onMediaSelect={setSelectedMedia}
                />
              </GridSizeContext.Provider>
            </div>
          </div>
        </ResizablePanel>
        <AnimatePresence mode="sync">
          {selectedMedia && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={50} minSize={20} maxSize={50}>
                <MediaDetail media={selectedMedia} onClose={() => setSelectedMedia(null)} />
              </ResizablePanel>
            </>
          )}
        </AnimatePresence>
      </PanelGroup>
    </div>
  );
};
