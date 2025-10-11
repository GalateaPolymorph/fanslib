import { Button } from "@renderer/components/ui/Button";
import { useToast } from "@renderer/components/ui/Toast/use-toast";
import { useSettings } from "@renderer/contexts/SettingsContext";
import { useChannels } from "@renderer/hooks/api/useChannels";
import { useRedgifsUrl } from "@renderer/hooks/api/useRedgifsUrl";
import { CheckCircle, ExternalLink } from "lucide-react";
import { Post } from "src/features/posts/entity";
import { CHANNEL_TYPES } from "../../../features/channels/channelTypes";
import { Media } from "../../../features/library/entity";

type CreatePostFromRedgifsURLButtonProps = {
  media: Media;
  onPostCreatedOrFound?: (post: Post) => void;
  className?: string;
};

export const CreatePostFromRedgifsURLButton = ({
  media,
  onPostCreatedOrFound,
  className,
}: CreatePostFromRedgifsURLButtonProps) => {
  const { toast } = useToast();
  const { settings } = useSettings();
  const { data: channels = [] } = useChannels();
  const { url } = useRedgifsUrl(media);

  const createPostWithUrl = async (redgifsUrl: string) => {
    try {
      // Check if there's already a post with this URL
      const existingPost = await window.api["post:byUrl"](redgifsUrl);
      if (existingPost) {
        toast({
          title: "Post already exists",
          description: "A post with this RedGIFs URL already exists",
        });
        onPostCreatedOrFound?.(existingPost);
        return;
      }

      // Get RedGIFs channel
      const redgifsChannel = channels.find((c) => c.typeId === CHANNEL_TYPES.redgifs.id);
      if (!redgifsChannel) {
        toast({
          title: "No RedGIFs channel found",
          description: "Please create a RedGIFs channel first",
          variant: "destructive",
        });
        return;
      }

      // Create the post
      const post = await window.api["post:create"](
        {
          date: new Date().toISOString(),
          channelId: redgifsChannel.id,
          status: "posted",
          caption: "",
          url: redgifsUrl,
        },
        [media.id]
      );

      toast({
        title: "Post created successfully",
      });

      onPostCreatedOrFound?.(post);
    } catch (error) {
      console.error("Failed to create post:", error);
      toast({
        title: "Failed to create post",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const hasRedgifsChannel = channels.some((c) => c.typeId === CHANNEL_TYPES.redgifs.id);
  const hasPostponeToken = !!settings?.postponeToken;

  if (!hasRedgifsChannel || !hasPostponeToken || media?.type !== "video" || !url) {
    return null;
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      <Button
        onClick={() => createPostWithUrl(url)}
        variant="ghost"
        className="flex items-center gap-2"
      >
        <CheckCircle className="h-4 w-4 text-green-500" />
        Create Post from RedGIFs URL
      </Button>
      <Button
        onClick={() => window.open(url, "_blank")}
        variant="ghost"
        size="sm"
        title="Open RedGIFs URL in browser"
      >
        <ExternalLink className="h-4 w-4" />
      </Button>
    </div>
  );
};
