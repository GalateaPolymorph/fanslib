import { useToast } from "@renderer/components/ui/Toast/use-toast";
import { channelKeys, useChannels } from "@renderer/hooks/api/useChannels";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronRight, Clock2, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { CHANNEL_TYPES } from "../../../../../features/channels/channelTypes";
import { Subreddit } from "../../../../../features/channels/subreddit";
import { GeneratedPost } from "../../../../../features/reddit-poster/api-type";
import { PostGenerationGrid } from "./PostGenerationGrid";
import { ScheduledPostsList } from "./ScheduledPostsList";

type RedditBulkPostGeneratorProps = {
  subreddits: Subreddit[];
};

export const RedditBulkPostGenerator = ({ subreddits }: RedditBulkPostGeneratorProps) => {
  const [generatedPosts, setGeneratedPosts] = useState<GeneratedPost[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const { toast } = useToast();
  const { data: channels = [] } = useChannels();
  const queryClient = useQueryClient();

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

  const scheduleAllPosts = async () => {
    if (!redditChannel) return;

    setIsScheduling(true);
    try {
      const postsToSchedule = generatedPosts.map((post) => ({
        subredditId: post.subreddit.id,
        mediaId: post.media.id,
        caption: post.caption,
        date: post.date,
      }));

      await window.api["reddit-poster:scheduleAllPosts"](postsToSchedule, redditChannel.id);

      setGeneratedPosts([]);
      queryClient.invalidateQueries({ queryKey: channelKeys.subreddits });
      queryClient.invalidateQueries({
        queryKey: ["reddit-poster", "scheduled-posts", redditChannel.id],
      });

      toast({
        headline: "Posts Scheduled",
        description: `${postsToSchedule.length} posts have been scheduled successfully.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        headline: "Scheduling Failed",
        description: error instanceof Error ? error.message : "Failed to schedule posts",
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
      <div className="flex flex-1 gap-6 p-6 overflow-hidden max-h-[80vh]">
        <div className="flex-[2] flex flex-col overflow-hidden">
          {generatedPosts.length > 0 ? (
            <PostGenerationGrid
              posts={generatedPosts}
              onUpdatePost={updatePost}
              onRegenerateMedia={regenerateMedia}
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

        {/* Scheduling Column - Thin column between grid and schedule list */}
        <div className="flex flex-col items-center justify-center">
          <button
            onClick={scheduleAllPosts}
            disabled={isScheduling || generatedPosts.length === 0}
            className="size-20 btn btn-neutral disabled:opacity-30"
            title={`Schedule ${generatedPosts.length} posts`}
          >
            <div className="flex items-center justify-center pl-2">
              <Clock2 className="text-neutral-content size-8 -mr-2" />
              <ChevronRight className="text-neutral-content size-8" />
            </div>
          </button>
          {generatedPosts.length > 0 && (
            <p className="text-xs text-gray-500 mt-2 text-center leading-tight">
              Schedule
              <br />
              {generatedPosts.length} posts
            </p>
          )}
        </div>

        {/* Queue Panel - Right Side (1/3 width) */}
        <div className="flex-1 flex flex-col bg-white rounded-lg overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            {redditChannel && <ScheduledPostsList channelId={redditChannel.id} />}
          </div>
        </div>
      </div>
    </div>
  );
};
