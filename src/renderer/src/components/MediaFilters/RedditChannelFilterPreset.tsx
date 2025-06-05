import { useChannels } from "@renderer/hooks/api/useChannels";
import { Copy } from "lucide-react";
import { CHANNEL_TYPES } from "../../../../features/channels/channelTypes";
import type { MediaFilters } from "../../../../features/library/api-type";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

type RedditChannelFilterPresetProps = {
  onApplyFilter: (filter: MediaFilters | undefined) => void;
  disabled?: boolean;
};

export const RedditChannelFilterPreset = ({
  onApplyFilter,
  disabled = false,
}: RedditChannelFilterPresetProps) => {
  const { data: channels = [] } = useChannels();

  const redditChannel = channels.find((c) => c.type.id === CHANNEL_TYPES.reddit.id);

  if (!redditChannel?.eligibleMediaFilter) {
    return null;
  }

  const applyRedditFilter = () => {
    onApplyFilter(redditChannel.eligibleMediaFilter);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={applyRedditFilter}
            disabled={disabled}
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copy the eligible media filter from the Reddit channel as a starting point</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
