import { Folder } from "lucide-react";
import { Media } from "../../../../features/library/entity";
import { Button } from "../../components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { useSettings } from "../../contexts/SettingsContext";

type Props = {
  media: Media;
};

export const MediaDetailRevealInFinderButton = ({ media }: Props) => {
  const { settings } = useSettings();

  const handleRevealInFinder = async () => {
    try {
      if (settings?.libraryPath) {
        // Use relative path with library path
        const resolvedPath =
          settings.libraryPath +
          (settings.libraryPath.endsWith("/") ? "" : "/") +
          media.relativePath;
        await window.api["os:revealInFinder"](resolvedPath);
      }
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
