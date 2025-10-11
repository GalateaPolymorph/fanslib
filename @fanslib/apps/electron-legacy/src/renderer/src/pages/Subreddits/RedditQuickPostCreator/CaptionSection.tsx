import { Textarea } from "@renderer/components/ui/Textarea";
import { SnippetSelector } from "@renderer/components/SnippetSelector";
import { useChannels } from "@renderer/hooks/api/useChannels";
import { CHANNEL_TYPES } from "../../../../../features/channels/channelTypes";
import { useRedditQuickPostContext } from "./RedditQuickPostContext";

export const CaptionSection = () => {
  const { postState, updateCaption } = useRedditQuickPostContext();
  const { data: channels = [] } = useChannels();

  const { caption, media, isLoading } = postState;
  const redditChannel = channels.find((c) => c.type.id === CHANNEL_TYPES.reddit.id);

  if (!media) {
    return (
      <div className="p-6 rounded-lg border">
        <p className="text-lg text-gray-400">Waiting for media selection</p>
      </div>
    );
  }

  if (!caption && isLoading) {
    return (
      <div className="p-6 rounded-lg border">
        <p className="text-lg text-gray-600">Generating caption...</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg border">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 relative">
          <Textarea
            value={caption}
            onChange={(e) => updateCaption(e.target.value)}
            placeholder="Enter your caption..."
            className="text-lg leading-relaxed font-medium min-h-[100px] resize-none pr-12"
            rows={4}
          />
          <SnippetSelector
            channelId={redditChannel?.id}
            caption={caption}
            onCaptionChange={updateCaption}
            className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
          />
        </div>
      </div>
    </div>
  );
};
