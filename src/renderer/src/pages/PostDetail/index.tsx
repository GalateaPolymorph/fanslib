import { ChannelBadge } from "@renderer/components/ChannelBadge";
import { Button } from "@renderer/components/ui/button";
import { usePost } from "@renderer/hooks";
import { useChannels } from "@renderer/hooks/api/useChannels";
import { cn } from "@renderer/lib/utils";
import { PostDetailAnalytics } from "@renderer/pages/PostDetail/PostDetailAnalytics";
import { PostDetailCaptionInput } from "@renderer/pages/PostDetail/PostDetailCaptionInput";
import { PostDetailDateInput } from "@renderer/pages/PostDetail/PostDetailDateInput";
import { PostDetailDeleteButton } from "@renderer/pages/PostDetail/PostDetailDeleteButton";
import { PostDetailFanslyStatisticsInput } from "@renderer/pages/PostDetail/PostDetailFanslyStatisticsInput";
import { PostDetailMedia } from "@renderer/pages/PostDetail/PostDetailMedia";
import { PostDetailNavigation } from "@renderer/pages/PostDetail/PostDetailNavigation";
import { PostDetailPostponeButton } from "@renderer/pages/PostDetail/PostDetailPostponeButton";
import { PostDetailStatusButton } from "@renderer/pages/PostDetail/PostDetailStatusButton";
import { PostDetailTimeInput } from "@renderer/pages/PostDetail/PostDetailTimeInput";
import { PostDetailUrlInput } from "@renderer/pages/PostDetail/PostDetailUrlInput";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CreatePostDialog } from "../MediaDetail/CreatePostDialog";

export const PostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const { data: channels = [] } = useChannels();

  const { data: post, isLoading, error } = usePost(postId);

  const openCreateDialog = (channelId: string) => {
    setSelectedChannelId(channelId);
    setIsCreateDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-semibold mb-4">Post not found</h1>
        <Button onClick={() => navigate(-1)}>Back</Button>
      </div>
    );
  }

  const otherChannels = channels.filter((channel) => channel.id !== post.channel.id);

  return (
    <>
      <CreatePostDialog
        open={isCreateDialogOpen}
        onOpenChange={(open) => {
          setIsCreateDialogOpen(open);
          if (!open) setSelectedChannelId(null);
        }}
        media={post.postMedia.map((pm) => pm.media)}
        initialDate={new Date(post.date)}
        initialChannelId={selectedChannelId}
        initialCaption={post.caption}
      />
      <div className="overflow-y-auto">
        <div className="max-w-[1280px] px-8 mx-auto pt-8 pb-12">
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div className="flex-1" />
            <PostDetailNavigation post={post} />
          </div>

          <div className="flex justify-between">
            <h1 className="text-3xl font-semibold tracking-tight">Post</h1>
            <div className="flex items-center gap-2">
              <PostDetailDeleteButton post={post} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 py-6">
            <div className="flex flex-col gap-2">
              <div className="self-start flex items-center gap-2 group">
                <ChannelBadge
                  name={post.subreddit ? `r/${post.subreddit.name}` : post.channel.name}
                  typeId={post.subreddit ? "reddit" : post.channel.type?.id || post.channel.typeId}
                  size="lg"
                />
              </div>
              <PostDetailMedia post={post} variant="detail" />
              {otherChannels.length > 0 && (
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-sm text-muted-foreground">Duplicate this post to:</span>
                  {otherChannels.map((channel) => (
                    <button
                      key={channel.id}
                      onClick={() => openCreateDialog(channel.id)}
                      className={cn(
                        "transition-opacity hover:opacity-80",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        "rounded-md"
                      )}
                    >
                      <ChannelBadge
                        selected={false}
                        selectable
                        name={channel.name}
                        typeId={channel.type.id}
                      />
                    </button>
                  ))}
                </div>
              )}
              <PostDetailPostponeButton post={post} />
            </div>
            <div className="flex flex-col gap-3">
              <PostDetailStatusButton post={post} />
              <div className="border rounded-md p-2 grid w-auto grid-cols-[2fr_1fr] gap-2">
                <PostDetailDateInput post={post} />
                <PostDetailTimeInput post={post} />
              </div>
              <PostDetailUrlInput post={post} />
              {(post.channel.type?.id || post.channel.typeId) === "fansly" && (
                <PostDetailFanslyStatisticsInput post={post} />
              )}
              <PostDetailCaptionInput post={post} />
            </div>
          </div>
          <div className="mt-8">
            <PostDetailAnalytics post={post} />
          </div>
        </div>
      </div>
    </>
  );
};
