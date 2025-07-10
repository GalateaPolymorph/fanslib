import { Button } from "@renderer/components/ui/button";
import { useToast } from "@renderer/components/ui/use-toast";
import { CheckCircle, Loader2, Send } from "lucide-react";
import { useState } from "react";
import { AutoPostButton } from "./AutoPostButton";
import { useRedditQuickPostContext } from "./RedditQuickPostContext";

export const PostActionSection = () => {
  const { postState, openRedditPost, markAsPosted } = useRedditQuickPostContext();
  const { toast } = useToast();
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  const { subreddit, media, caption, isUrlReady, isLoading, hasPostedToReddit } = postState;
  const isReadyToPost = subreddit && media && caption.trim();

  const handleMarkAsPosted = async () => {
    setIsCreatingPost(true);
    try {
      await markAsPosted();
      toast({
        title: "Post created successfully",
        description: "Your Reddit post has been saved to your post library.",
      });
    } catch (error) {
      toast({
        title: "Failed to create post",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsCreatingPost(false);
    }
  };

  if (!isReadyToPost) {
    return (
      <div className="flex flex-col justify-center">
        <div className="sticky top-8">
          <div className="px-8 py-4 text-lg text-gray-400 border border-gray-200 rounded-lg bg-gray-50 flex items-center gap-3">
            <Send className="h-5 w-5" />
            {isLoading ? "Generating post..." : "Preparing post..."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center">
      <div className="sticky top-8 space-y-4">
        <Button
          onClick={openRedditPost}
          size="lg"
          disabled={!isUrlReady || isLoading}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg h-auto flex items-center gap-3 whitespace-nowrap"
        >
          <Send className="h-5 w-5" />
          Post to Reddit
        </Button>

        <AutoPostButton />

        {hasPostedToReddit && (
          <Button
            onClick={handleMarkAsPosted}
            size="lg"
            variant="outline"
            disabled={isCreatingPost}
            className="px-8 py-4 text-lg h-auto flex items-center gap-3 whitespace-nowrap border-green-500 text-green-600 hover:bg-green-50 disabled:opacity-50"
          >
            {isCreatingPost ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <CheckCircle className="h-5 w-5" />
            )}
            {isCreatingPost ? "Creating Post..." : "Mark Posted"}
          </Button>
        )}
      </div>
    </div>
  );
};
