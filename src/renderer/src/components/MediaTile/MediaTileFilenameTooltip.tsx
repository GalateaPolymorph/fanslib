import { Media } from "../../../../features/library/entity";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

type MediaFileFilenameTooltipProps = {
  media: Media;
  children: React.ReactNode;
};

export const MediaFileFilenameTooltip = ({ media, children }: MediaFileFilenameTooltipProps) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="bg-white text-black p-2 rounded-md shadow-lg max-w-[300px] break-all"
          sideOffset={5}
        >
          {media.name}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
