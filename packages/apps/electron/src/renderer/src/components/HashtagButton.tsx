import { Button } from "@renderer/components/ui/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@renderer/components/ui/Tooltip";
import { useToast } from "@renderer/components/ui/Toast/use-toast";
import { Hash } from "lucide-react";
import { Channel } from "src/features/channels/entity";

type HashtagButtonProps = {
  channel: Channel;
  caption: string;
  onCaptionChange: (caption: string) => void;
  className?: string;
};

export const HashtagButton = ({
  channel,
  caption = "",
  onCaptionChange,
  className,
}: HashtagButtonProps) => {
  const { toast } = useToast();

  const collectHashtags = () => {
    const channelHashtags = channel?.defaultHashtags ?? [];

    // Deduplicate hashtags
    const uniqueHashtags = Array.from(new Set([...channelHashtags]));

    return uniqueHashtags.map((hashtag) =>
      hashtag.name.startsWith("#") ? hashtag.name : `#${hashtag.name}`
    );
  };

  const addHashtags = () => {
    const hashtags = collectHashtags();
    if (hashtags.length === 0) {
      toast({
        title: "No hashtags found",
        description: "Add hashtags to the channel first",
        variant: "destructive",
      });
      return;
    }

    const newHashtags = hashtags.filter((hashtag) => !caption.includes(hashtag));
    if (newHashtags.length === 0) {
      toast({
        title: "No new hashtags",
        description: "All available hashtags are already in the caption",
      });
      return;
    }

    const hashtagString = newHashtags.join(" ");
    const lastHashtagIndex = caption.lastIndexOf("#");

    if (lastHashtagIndex === -1) {
      // No hashtags in caption, add to the end with a newline
      const newCaption = caption ? `${caption}\n\n${hashtagString}` : hashtagString;
      onCaptionChange(newCaption);
      return;
    }

    // Find the end of the last hashtag block
    const afterLastHashtag = caption.slice(lastHashtagIndex);
    const endOfLastHashtagBlock = afterLastHashtag.search(/[^\s#\w]/);
    const insertPosition =
      endOfLastHashtagBlock === -1 ? caption.length : lastHashtagIndex + endOfLastHashtagBlock;

    const newCaption = `${caption.slice(0, insertPosition)} ${hashtagString}${caption.slice(insertPosition)}`;
    onCaptionChange(newCaption);
  };

  if (collectHashtags().length === 0) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className={className} onClick={addHashtags}>
            <Hash className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Adds all channel default hashtags to the caption</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
