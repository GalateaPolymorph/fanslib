import { Button } from "@renderer/components/ui/button";
import { useToast } from "@renderer/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { Bot, Loader2 } from "lucide-react";
import { PostToRedditPayload, RedditPostResult } from "../../../../../features/automation/api-type";
import { useRedditQuickPostContext } from "./RedditQuickPostContext";

const useAutomatedRedditPost = () => {
  const { toast } = useToast();

  return useMutation<RedditPostResult, Error, PostToRedditPayload>({
    mutationFn: async (payload: PostToRedditPayload) => {
      const result = await window.api["automation:postToReddit"](payload);
      if (!result.success) {
        throw new Error(result.error || "Failed to post to Reddit");
      }
      return result;
    },
    onSuccess: (result) => {
      toast({
        title: "Automated post successful",
        description: result.url ? `Posted to Reddit: ${result.url}` : "Post completed successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Automated post failed",
        description: error.message || "Unknown error occurred",
        variant: "destructive",
      });
    },
  });
};

export type AutoPostButtonProps = {
  onPostSuccess?: () => void;
};

export const AutoPostButton = ({ onPostSuccess }: AutoPostButtonProps) => {
  const { postState } = useRedditQuickPostContext();
  const automatedPostMutation = useAutomatedRedditPost();

  const { subreddit, media, caption, isUrlReady, isLoading } = postState;
  const isReadyToPost = subreddit && media && caption.trim();

  const handleAutomatedPost = async () => {
    if (!isReadyToPost) {
      console.log("Post not ready:", { subreddit, media, caption });
      return;
    }

    console.log("Post data:", { subreddit, media, caption });

    const payload: PostToRedditPayload = {
      subredditId: subreddit.id,
      mediaId: media.id,
      caption: caption,
    };

    console.log("Automated post payload:", payload);
    automatedPostMutation.mutate(payload);

    onPostSuccess?.();
  };

  return (
    <Button
      onClick={handleAutomatedPost}
      size="lg"
      disabled={!isReadyToPost || !isUrlReady || isLoading || automatedPostMutation.isPending}
      className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 text-lg h-auto flex items-center gap-3 whitespace-nowrap"
    >
      {automatedPostMutation.isPending ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Bot className="h-5 w-5" />
      )}
      {automatedPostMutation.isPending ? "Posting..." : "Auto Post"}
    </Button>
  );
};
