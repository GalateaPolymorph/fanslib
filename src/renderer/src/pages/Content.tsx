import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { PanelGroup } from "react-resizable-panels";
import { Gallery } from "../components/Gallery";
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

  if (loading) {
    return null;
  }

  if (!settings?.libraryPath) {
    return <WelcomeScreen />;
  }

  return (
    <div className="h-full w-full">
      <PanelGroup direction="horizontal" className="w-full">
        <ResizablePanel defaultSize={70} minSize={30}>
          <div className="flex flex-col p-8">
            <LibraryFilters onFilterChange={setFilters} />
            <Gallery
              media={media}
              scanning={scanning}
              error={error ?? undefined}
              onMediaSelect={setSelectedMedia}
            />
          </div>
        </ResizablePanel>
        <AnimatePresence mode="sync">
          {selectedMedia && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
                <MediaDetail media={selectedMedia} onClose={() => setSelectedMedia(null)} />
              </ResizablePanel>
            </>
          )}
        </AnimatePresence>
      </PanelGroup>
    </div>
  );
};
