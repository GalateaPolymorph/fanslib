import { MediaTile } from "@renderer/components/MediaTile";
import { Button } from "@renderer/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@renderer/components/ui/Dialog";
import { ScrollArea } from "@renderer/components/ui/ScrollArea";
import { Status } from "@renderer/components/ui/Status";
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
import {
  AlertCircleIcon,
  ChevronRightIcon,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import { ScheduledPost } from "../../../../../features/reddit-poster/api-type";

type ScheduledPostsListProps = {
  channelId: string;
};

export const ScheduledPostsList = ({ channelId }: ScheduledPostsListProps) => {
  const { data: scheduledPosts = [], isLoading } = useQuery({
    queryKey: ["reddit-poster", "scheduled-posts", channelId],
    queryFn: () => window.api["reddit-poster:getScheduledPosts"](),
    refetchInterval: 10000, // Refresh every 10 seconds for real-time updates
  });

  if (isLoading) {
    return <div className="p-4 text-center text-gray-600">Loading scheduled posts...</div>;
  }

  if (scheduledPosts.length === 0) {
    return <div className="p-4 text-center text-gray-600">No scheduled posts found.</div>;
  }

  const groupedPosts = scheduledPosts.reduce(
    (acc, post) => {
      // Handle UTC dates properly - if no timezone info, assume UTC
      const postDate = post.scheduledDate.includes('T') || post.scheduledDate.includes('Z') 
        ? new Date(post.scheduledDate)
        : new Date(post.scheduledDate + 'Z'); // Add 'Z' to indicate UTC
      const dayKey = format(postDate, "yyyy-MM-dd");
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

type QueueStatusBadgeProps = {
  status?: "queued" | "processing" | "posted" | "failed";
  isServerJob: boolean;
  errorMessage?: string;
};

const QueueStatusBadge = ({ status, isServerJob, errorMessage }: QueueStatusBadgeProps) => {
  if (!isServerJob) {
    return (
      <Status variant="neutral" size="sm">
        <span className="text-xs text-gray-600">Local</span>
      </Status>
    );
  }

  const statusConfig = {
    queued: { variant: "info" as const, label: "Queued", textColor: "text-blue-700" },
    processing: { variant: "warning" as const, label: "Processing", textColor: "text-orange-700" },
    posted: { variant: "success" as const, label: "Posted", textColor: "text-green-700" },
    failed: { variant: "error" as const, label: "Failed", textColor: "text-red-700" },
  };

  const config = statusConfig[status || "queued"];

  // If it's a failed status with an error message, make it clickable and show modal
  if (status === "failed" && errorMessage) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <button className="flex items-center gap-1 hover:opacity-80 transition-opacity">
            <Status variant={config.variant} size="sm">
              <span className={`text-xs ${config.textColor} cursor-pointer`}>{config.label}</span>
            </Status>
            <ChevronRightIcon size={12} className={`${config.textColor} opacity-60`} />
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircleIcon size={20} />
              Post Failed
            </DialogTitle>
            <DialogDescription>
              This post failed to be published. Here are the details:
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <pre className="text-sm text-red-800 whitespace-pre-wrap break-words font-mono">
                {errorMessage}
              </pre>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // For other statuses, show regular non-clickable status
  return (
    <Status variant={config.variant} size="sm">
      <span className={`text-xs ${config.textColor}`}>{config.label}</span>
    </Status>
  );
};

type ScheduledPostCardProps = {
  post: ScheduledPost;
  channelId: string;
};

const ScheduledPostCard = ({ post, channelId }: ScheduledPostCardProps) => {
  // Handle UTC dates properly - if no timezone info, assume UTC
  const scheduledDate = post.scheduledDate.includes('T') || post.scheduledDate.includes('Z') 
    ? new Date(post.scheduledDate)
    : new Date(post.scheduledDate + 'Z'); // Add 'Z' to indicate UTC
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);
  const [isDeletingServerJob, setIsDeletingServerJob] = useState(false);
  const deletePostMutation = useDeletePost();
  const queryClient = useQueryClient();
  const isServerJob = !!post.serverJobId;

  const handleDeleteClick = async () => {
    if (confirmingDelete === post.id) {
      try {
        if (isServerJob && post.serverJobId) {
          // Delete server job
          setIsDeletingServerJob(true);
          await window.api["server-communication:deleteJob"](post.serverJobId);
        } else {
          // Delete local post
          await new Promise((resolve, reject) => {
            deletePostMutation.mutate(post.id, {
              onSuccess: resolve,
              onError: reject,
            });
          });
        }

        // Invalidate the scheduled posts query to refresh the list
        queryClient.invalidateQueries({
          queryKey: ["reddit-poster", "scheduled-posts", channelId],
        });
        setConfirmingDelete(null);
      } catch (error) {
        console.error("Failed to delete scheduled post:", error);
        // TODO: Show error toast to user
        setConfirmingDelete(null);
      } finally {
        setIsDeletingServerJob(false);
      }
    } else {
      setConfirmingDelete(post.id);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "bg-base-100 shadow-sm rounded-lg p-3 space-y-2 grid grid-cols-[auto_2fr_auto] gap-4",
              isServerJob && "border-l-4",
              post.status === "queued" && "border-l-blue-400",
              post.status === "processing" && "border-l-orange-400",
              post.status === "posted" && "border-l-green-400",
              post.status === "failed" && "border-l-red-400"
            )}
          >
            <div className="flex flex-col gap-2">
              <p className={`text-2xl font-bold`}>{format(scheduledDate, "HH:mm")}</p>
              <QueueStatusBadge 
                status={post.status} 
                isServerJob={isServerJob} 
                errorMessage={post.errorMessage}
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">r/{post.subreddit.name}</h4>
                {post.postUrl && (
                  <a
                    href={post.postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Post
                  </a>
                )}
              </div>
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
          {/* Only show delete button for queued jobs or local posts */}
          {(!isServerJob || post.status === "queued" || post.status === "failed") && (
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
              disabled={deletePostMutation.isPending || isDeletingServerJob}
            >
              <div className="flex items-center gap-1.5">
                <Trash2Icon size={14} />
                {confirmingDelete === post.id && (
                  <span className="text-xs">
                    {deletePostMutation.isPending || isDeletingServerJob ? "..." : "Sure?"}
                  </span>
                )}
              </div>
            </Button>
          )}
          {/* Show disabled state for processing/posted jobs */}
          {isServerJob && (post.status === "processing" || post.status === "posted") && (
            <div className="h-7 w-7 flex items-center justify-center text-muted-foreground/50">
              <Trash2Icon size={14} />
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
