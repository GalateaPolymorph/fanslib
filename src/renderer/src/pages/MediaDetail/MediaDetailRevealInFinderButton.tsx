import { Folder } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";

type Props = {
  path: string;
};

export const MediaDetailRevealInFinderButton = ({ path }: Props) => {
  const handleRevealInFinder = async () => {
    try {
      await window.api["os:revealInFinder"](path);
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
