import { Button } from "@renderer/components/ui/button";
import { useToast } from "@renderer/components/ui/use-toast";
import { useChannels } from "@renderer/contexts/ChannelContext";
import { useSettings } from "@renderer/contexts/SettingsContext";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CHANNEL_TYPES } from "../../../../features/channels/channelTypes";
import { Media } from "../../../../features/library/entity";

type PostponeRedgifsButtonProps = {
  media: Media;
};

export const PostponeRedgifsButton = ({ media }: PostponeRedgifsButtonProps) => {
  const { toast } = useToast();
  const { settings } = useSettings();
  const { channels } = useChannels();
  const navigate = useNavigate();

  const findRedgifsUrlAndCreatePost = async () => {
    try {
      // First find the RedGIFs URL
      const { url } = await window.api["api-postpone:findRedgifsURL"]({ mediaId: media.id });
      if (!url) {
        toast({
          title: "No RedGIFs URL found",
          variant: "destructive",
        });
        return;
      }

      // Check if there's already a post with this URL
      const existingPost = await window.api["post:byUrl"](url);
      if (existingPost) {
        toast({
          title: "Post already exists",
          description: "A post with this RedGIFs URL already exists",
        });
        navigate(`/posts/${existingPost.id}`);
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
          url: url,
        },
        [media.id]
      );

      toast({
        title: "Post created successfully",
      });

      navigate(`/posts/${post.id}`);
    } catch (error) {
      console.error("Failed to find RedGIFs URL and create post:", error);
      toast({
        title: "Failed to create post",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const hasRedgifsChannel = channels.some((c) => c.typeId === CHANNEL_TYPES.redgifs.id);
  const hasPostponeToken = !!settings?.postponeToken;
  if (!hasRedgifsChannel || !hasPostponeToken) {
    return null;
  }

  return (
    <Button onClick={findRedgifsUrlAndCreatePost} className="self-center" variant="ghost">
      <Search className="h-4 w-4" />
      Check Postpone for RedGIFs URL
    </Button>
  );
};
