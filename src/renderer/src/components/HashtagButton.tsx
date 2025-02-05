import { Button } from "@renderer/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@renderer/components/ui/tooltip";
import { useToast } from "@renderer/components/ui/use-toast";
import { useSettings } from "@renderer/contexts/SettingsContext";
import { Hash } from "lucide-react";
import { Media } from "../../../features/library/entity";

type HashtagButtonProps = {
  media: Media[];
  caption: string;
  onCaptionChange: (caption: string) => void;
  className?: string;
};

export const HashtagButton = ({
  media,
  caption,
  onCaptionChange,
  className,
}: HashtagButtonProps) => {
  const { toast } = useToast();
  const { settings } = useSettings();

  const collectHashtags = () => {
    const defaultHashtags = settings?.defaultHashtags ?? [];

    // Get all unique hashtags from all media tags
    const mediaHashtags = media
      .map((m) => m.tags ?? [])
      .flat()
      .map((tag) => tag.hashtags ?? [])
      .flat();

    // Combine and deduplicate hashtags
    const uniqueHashtags = Array.from(new Set([...defaultHashtags, ...mediaHashtags]));

    return uniqueHashtags.map((hashtag) => (hashtag.startsWith("#") ? hashtag : `#${hashtag}`));
  };

  const addHashtags = () => {
    const hashtags = collectHashtags();
    if (hashtags.length === 0) {
      toast({
        title: "No hashtags found",
        description: "Add hashtags to your settings or media tags first",
        variant: "destructive",
      });
      return;
    }

    const hashtagString = hashtags.join(" ");
    const newCaption = caption ? `${caption}\n\n${hashtagString}` : hashtagString;
    onCaptionChange(newCaption);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className={className} onClick={addHashtags}>
            <Hash className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          Adds the default hashtags and all media tags to the caption
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
