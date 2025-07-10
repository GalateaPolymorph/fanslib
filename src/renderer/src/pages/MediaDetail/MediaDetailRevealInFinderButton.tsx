import { Folder } from "lucide-react";
import { Media } from "../../../../features/library/entity";
import { useSettings } from "../../contexts/SettingsContext";
import { Button } from "../../components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";

type Props = {
  media: Media;
};

export const MediaDetailRevealInFinderButton = ({ media }: Props) => {
  const { settings } = useSettings();

  const handleRevealInFinder = async () => {
    try {
      // Resolve the media path
      let resolvedPath = media.path; // fallback to absolute path
      
      if (media.relativePath && settings?.libraryPath) {
        // Use relative path with library path
        resolvedPath = settings.libraryPath + (settings.libraryPath.endsWith('/') ? '' : '/') + media.relativePath;
      }
      
      await window.api["os:revealInFinder"](resolvedPath);
    } catch (error) {
      console.error("Failed to reveal in finder:", error);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" onClick={handleRevealInFinder}>
            <Folder className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Reveal in Finder</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
