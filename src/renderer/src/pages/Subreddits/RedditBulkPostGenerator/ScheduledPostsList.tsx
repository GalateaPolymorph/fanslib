import { MediaTile } from "@renderer/components/MediaTile";
import { Button } from "@renderer/components/ui/Button";
import { ScrollArea } from "@renderer/components/ui/ScrollArea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@renderer/components/ui/Tooltip";
import { MediaSelectionProvider } from "@renderer/contexts/MediaSelectionContext";
import { useDeletePost } from "@renderer/hooks/api/usePost";
import { cn } from "@renderer/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { ScheduledPost } from "../../../../../features/reddit-poster/api-type";

type ScheduledPostsListProps = {
  channelId: string;
};

export const ScheduledPostsList = ({ channelId }: ScheduledPostsListProps) => {
  const { data: scheduledPosts = [], isLoading } = useQuery({
    queryKey: ["reddit-poster", "scheduled-posts", channelId],
    queryFn: () => window.api["reddit-poster:getScheduledPosts"](channelId),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return <div className="p-4 text-center text-gray-600">Loading scheduled posts...</div>;
  }

  if (scheduledPosts.length === 0) {
    return <div className="p-4 text-center text-gray-600">No scheduled posts found.</div>;
  }

  const groupedPosts = scheduledPosts.reduce(
    (acc, post) => {
      const dayKey = format(new Date(post.scheduledDate), "yyyy-MM-dd");
      return {
        ...acc,
        [dayKey]: [...(acc[dayKey] ?? []), post],
      };
    },
    {} as Record<string, ScheduledPost[]>
  );

  const sortedDays = Object.keys(groupedPosts).sort();

  return (
    <ScrollArea className="p-4 bg-base-300">
      {sortedDays.map((dayKey) => (
        <DayGroup key={dayKey} dayKey={dayKey} posts={groupedPosts[dayKey]} channelId={channelId} />
      ))}
    </ScrollArea>
  );
};

type DayGroupProps = {
  dayKey: string;
  posts: ScheduledPost[];
  channelId: string;
};

const DayGroup = ({ dayKey, posts, channelId }: DayGroupProps) => {
  const date = new Date(dayKey);
  const today = new Date();
  const isToday = format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
  const isYesterday =
    format(date, "yyyy-MM-dd") ===
    format(new Date(today.getTime() - 24 * 60 * 60 * 1000), "yyyy-MM-dd");
  const isTomorrow =
    format(date, "yyyy-MM-dd") ===
    format(new Date(today.getTime() + 24 * 60 * 60 * 1000), "yyyy-MM-dd");

  const dayLabel = isToday
    ? "Today"
    : isYesterday
      ? "Yesterday"
      : isTomorrow
        ? "Tomorrow"
        : format(date, "EEEE, MMMM d");

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">{dayLabel}</h3>
      <div className="flex flex-col gap-3">
        {posts.map((post) => (
          <ScheduledPostCard key={post.id} post={post} channelId={channelId} />
        ))}
      </div>
    </div>
  );
};

type ScheduledPostCardProps = {
  post: ScheduledPost;
  channelId: string;
};

const ScheduledPostCard = ({ post, channelId }: ScheduledPostCardProps) => {
  const scheduledDate = new Date(post.scheduledDate);
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);
  const deletePostMutation = useDeletePost();
  const queryClient = useQueryClient();

  const handleDeleteClick = () => {
    if (confirmingDelete === post.id) {
      deletePostMutation.mutate(post.id, {
        onSuccess: () => {
          // Invalidate the scheduled posts query to refresh the list
          queryClient.invalidateQueries({
            queryKey: ["reddit-poster", "scheduled-posts", channelId],
          });
          setConfirmingDelete(null);
        },
        onError: (error) => {
          console.error("Failed to delete scheduled post:", error);
          setConfirmingDelete(null);
        },
      });
    } else {
      setConfirmingDelete(post.id);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <div
            className={`bg-base-100 shadow-sm rounded-lg p-3 space-y-2 grid grid-cols-[auto_2fr_auto] gap-4`}
          >
            <div className="flex flex-col gap-2">
              <p className={`text-2xl font-bold`}>{format(scheduledDate, "hh:mm")}</p>
            </div>

            <div className="flex flex-col gap-1">
              <h4 className="font-semibold">r/{post.subreddit.name}</h4>
              {post.caption && <p className="text-xs text-gray-600 line-clamp-3">{post.caption}</p>}
            </div>
            {post.media && (
              <div className="size-20 flex-shrink-0">
                <MediaSelectionProvider media={[post.media]}>
                  <MediaTile
                    withPreview
                    media={post.media}
                    allMedias={[post.media]}
                    index={0}
                    className="w-full h-full object-cover rounded"
                  />
                </MediaSelectionProvider>
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          className="flex gap-1 p-1.5 bg-background border border-border"
        >
          <Button
            variant="ghost"
            size={confirmingDelete === post.id ? "default" : "icon"}
            className={cn(
              "h-7 text-muted-foreground hover:text-destructive transition-all duration-100",
              confirmingDelete === post.id ? "w-[72px] px-2" : "w-7"
            )}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick();
            }}
            onMouseLeave={() => setConfirmingDelete(null)}
            disabled={deletePostMutation.isPending}
          >
            <div className="flex items-center gap-1.5">
              <Trash2Icon size={14} />
              {confirmingDelete === post.id && (
                <span className="text-xs">
                  {deletePostMutation.isPending ? "..." : "Sure?"}
                </span>
              )}
            </div>
          </Button>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
