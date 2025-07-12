import { useToast } from "@renderer/components/ui/Toast/use-toast";
import { useSettings } from "@renderer/contexts/SettingsContext";
import { Media } from "../../../../features/library/entity";

type UseOsDragReturn = {
  startOsDrag: (medias: Media[]) => Promise<void>;
  isOsDragAvailable: boolean;
};

export const useOsDrag = (): UseOsDragReturn => {
  const { toast } = useToast();
  const { settings } = useSettings();

  const startOsDrag = async (medias: Media[]): Promise<void> => {
    try {
      if (medias.length === 0) {
        return;
      }

      if (!settings?.libraryPath) {
        throw new Error("Library path not configured");
      }

      // Resolve media paths using the library path and relativePath
      const filePaths = medias.map((media) => {
        // Use path joining to avoid issues with separators
        return (
          settings.libraryPath +
          (settings.libraryPath.endsWith("/") ? "" : "/") +
          media.relativePath
        );
      });

      await window.api["os:startDrag"](filePaths);
    } catch (error) {
      console.error("Failed to start OS drag:", error);
      toast({
        title: "Failed to start file drag",
        description: "Could not initiate file drag operation",
        variant: "destructive",
      });
    }
  };

  const isOsDragAvailable =
    typeof window !== "undefined" && typeof window.api?.["os:startDrag"] === "function";

  return {
    startOsDrag,
    isOsDragAvailable,
  };
};
