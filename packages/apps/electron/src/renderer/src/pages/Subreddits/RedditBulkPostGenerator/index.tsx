import { RedditConnectionStatus } from "@renderer/components/RedditConnectionStatus";
import { useToast } from "@renderer/components/ui/Toast/use-toast";
import { channelKeys, useChannels } from "@renderer/hooks/api/useChannels";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronRight, Clock2, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { CHANNEL_TYPES } from "../../../../../features/channels/channelTypes";
import { Subreddit } from "../../../../../features/channels/subreddit";
import { GeneratedPost } from "../../../../../features/reddit-poster/api-type";
import { useServerStatus } from "../../../hooks/useServerStatus/useServerStatus";
import { PostGenerationGrid } from "./PostGenerationGrid";
import { ScheduledPostsList } from "./ScheduledPostsList";
import { validatePost } from "./validatePost";

type RedditBulkPostGeneratorProps = {
  subreddits: Subreddit[];
};

export const RedditBulkPostGenerator = ({ subreddits }: RedditBulkPostGeneratorProps) => {
  const [generatedPosts, setGeneratedPosts] = useState<GeneratedPost[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [schedulingPostId, setSchedulingPostId] = useState<string | null>(null);
  const { toast } = useToast();
  const { data: channels = [] } = useChannels();
  const queryClient = useQueryClient();

  const { isAvailable: isServerAvailable, isUnavailable: isServerUnavailable } = useServerStatus();

  const redditChannel = channels.find((c) => c.type.id === CHANNEL_TYPES.reddit.id);

  const generatePosts = async () => {
    if (!redditChannel) {
      toast({
        variant: "destructive",
        headline: "No Reddit Channel",
        description: "Please set up a Reddit channel first.",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const posts = await window.api["reddit-poster:generatePosts"](
        5,
        subreddits,
        redditChannel.id
      );
      setGeneratedPosts(posts);
    } catch (error) {
      toast({
        variant: "destructive",
        headline: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate posts",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const updatePost = (index: number, updates: Partial<GeneratedPost>) => {
    setGeneratedPosts((prev) =>
      prev.map((post, i) => (i === index ? { ...post, ...updates } : post))
    );
  };

  const regenerateMedia = async (index: number) => {
    if (!redditChannel) return;

    const post = generatedPosts[index];
    if (!post) return;

    try {
      const regeneratedData = await window.api["reddit-poster:regenerateMedia"](
        post.subreddit.id,
        redditChannel.id
      );

      updatePost(index, {
        media: regeneratedData.media,
        caption: regeneratedData.caption,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        headline: "Regeneration Failed",
        description: error instanceof Error ? error.message : "Failed to regenerate media",
      });
    }
  };

  const scheduleIndividualPost = async (postId: string) => {
    if (!redditChannel) return;

    const post = generatedPosts.find((p) => p.id === postId);
    if (!post) return;

    const validationErrors = validatePost([post]);
    if (validationErrors.length > 0) {
      return;
    }

    setSchedulingPostId(postId);
    try {
      await window.api["server-communication:schedulePostsToServer"]([post]);

      // Remove the scheduled post from the grid
      setGeneratedPosts((prev) => prev.filter((p) => p.id !== postId));

      queryClient.invalidateQueries({ queryKey: channelKeys.subreddits });
      queryClient.invalidateQueries({
        queryKey: ["reddit-poster", "scheduled-posts", redditChannel.id],
      });

      toast({
        headline: "Post Scheduled to Server",
        description: "Post has been scheduled to the server queue successfully.",
      });
    } finally {
      setSchedulingPostId(null);
    }
  };

  const discardPost = (postId: string) => {
    setGeneratedPosts((prev) => prev.filter((p) => p.id !== postId));
    
    toast({
      headline: "Post Discarded",
      description: "Post has been removed from the generation grid.",
    });
  };

  const scheduleAllPostsToServer = async () => {
    if (!redditChannel) return;

    const validationErrors = validatePost(generatedPosts);
    if (validationErrors.length > 0) {
      return;
    }

    setIsScheduling(true);

    try {
      const results =
        await window.api["server-communication:schedulePostsToServer"](generatedPosts);
      
      // Clear all generated posts after successful scheduling attempt
      setGeneratedPosts([]);

      queryClient.invalidateQueries({ queryKey: channelKeys.subreddits });
      queryClient.invalidateQueries({
        queryKey: ["reddit-poster", "scheduled-posts", redditChannel.id],
      });

      const successful = results.filter((r) => r.status === "queued");
      toast({
        headline: "Posts Scheduled",
        description: `Successfully scheduled ${successful.length} out of ${results.length} posts to the server queue.`,
      });
    } finally {
      setIsScheduling(false);
    }
  };

  if (!redditChannel) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-gray-600">
          No Reddit channel found. Please set up a Reddit channel first.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 pt-4 pb-2 flex justify-start items-center">
        <RedditConnectionStatus size="md" />
      </div>


      <div className="flex flex-1 gap-6 p-6 overflow-hidden max-h-[80vh]">
        <div className="flex-[2] flex flex-col overflow-hidden">
          {generatedPosts.length > 0 ? (
            <PostGenerationGrid
              posts={generatedPosts}
              onUpdatePost={updatePost}
              onRegenerateMedia={regenerateMedia}
              onScheduleIndividualPost={scheduleIndividualPost}
              onDiscardPost={discardPost}
              isServerAvailable={isServerAvailable}
              isSchedulingPost={schedulingPostId}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg min-h-[60vh]">
              <div className="text-center py-12">
                <button
                  onClick={generatePosts}
                  disabled={isGenerating || subreddits.length === 0}
                  className="size-20 btn btn-neutral "
                >
                  {isGenerating ? (
                    <Loader2 className="size-12 animate-spin" />
                  ) : (
                    <Sparkles className="size-12" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-center">
          <button
            onClick={scheduleAllPostsToServer}
            disabled={isScheduling || generatedPosts.length === 0 || !isServerAvailable}
            className={`size-20 btn ${
              isScheduling
                ? "btn-primary loading"
                : !isServerAvailable
                  ? "btn-error disabled:opacity-50"
                  : "btn-primary"
            } disabled:opacity-30`}
            title={
              !isServerAvailable
                ? "Server unavailable - cannot schedule posts to server queue"
                : isScheduling
                  ? "Scheduling posts to server queue..."
                  : `Schedule all ${generatedPosts.length} posts to server queue for automated posting`
            }
          >
            <div className="flex items-center justify-center pl-2">
              {isScheduling ? (
                <Loader2 className="text-primary-content size-8 animate-spin" />
              ) : (
                <>
                  <Clock2 className="text-primary-content size-8 -mr-2" />
                  <ChevronRight className="text-primary-content size-8" />
                </>
              )}
            </div>
          </button>

          <div className="mt-2 text-center">
            {isScheduling ? (
              <div className="space-y-1">
                <p className="text-xs text-blue-600 leading-tight animate-pulse">
                  Scheduling to Server...
                </p>
              </div>
            ) : generatedPosts.length > 0 ? (
              <p className="text-xs text-gray-600 leading-tight">
                Schedule to Server Queue
                <br />
                <span className="font-medium">{generatedPosts.length} posts</span>
              </p>
            ) : (
              <p className="text-xs text-gray-400 leading-tight">
                Generate posts first
                <br />
                to schedule
              </p>
            )}

            {isServerUnavailable && (
              <p className="text-xs text-red-500 mt-1 leading-tight font-medium">
                ⚠️ Server Unavailable
                <br />
                <span className="font-normal">Check connection</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-white rounded-lg overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            {redditChannel && <ScheduledPostsList channelId={redditChannel.id} />}
          </div>
        </div>
      </div>
    </div>
  );
};
