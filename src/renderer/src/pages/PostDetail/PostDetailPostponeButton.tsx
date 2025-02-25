import { Button } from "@renderer/components/ui/button";
import { useToast } from "@renderer/components/ui/use-toast";
import { useSettings } from "@renderer/contexts/SettingsContext";
import { Send } from "lucide-react";
import { CHANNEL_TYPES } from "../../../../features/channels/channelTypes";
import { Post } from "../../../../features/posts/entity";

type PostDetailPostponeButtonProps = {
  post: Post;
};

export const PostDetailPostponeButton = ({ post }: PostDetailPostponeButtonProps) => {
  const { toast } = useToast();
  const { settings } = useSettings();

  if (
    post.channel.typeId !== CHANNEL_TYPES.bluesky.id ||
    !settings.postponeToken ||
    !settings.blueskyUsername ||
    post.status !== "draft"
  ) {
    return null;
  }

  const sendToPostpone = async () => {
    try {
      await window.api["api-postpone:draftBlueskyPost"]({ postId: post.id });

      toast({
        title: "Post sent to Postpone",
        description: "The draft has been created in your Postpone account.",
      });
    } catch (error) {
      console.error("Failed to send post to Postpone:", error);
      toast({
        title: "Failed to send post to Postpone",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-4">
      <Button onClick={sendToPostpone} className="w-full">
        <Send className="mr-2 h-4 w-4" />
        Send draft to Postpone
      </Button>
    </div>
  );
};
