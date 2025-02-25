import { ChannelBadge } from "@renderer/components/ChannelBadge";
import { Button } from "@renderer/components/ui/button";
import { useChannels } from "@renderer/contexts/ChannelContext";
import { cn } from "@renderer/lib/utils";
import { PostDetailCaptionInput } from "@renderer/pages/PostDetail/PostDetailCaptionInput";
import { PostDetailDateInput } from "@renderer/pages/PostDetail/PostDetailDateInput";
import { PostDetailDeleteButton } from "@renderer/pages/PostDetail/PostDetailDeleteButton";
import { PostDetailMedia } from "@renderer/pages/PostDetail/PostDetailMedia";
import { PostDetailPostponeButton } from "@renderer/pages/PostDetail/PostDetailPostponeButton";
import { PostDetailStatusButton } from "@renderer/pages/PostDetail/PostDetailStatusButton";
import { PostDetailTimeInput } from "@renderer/pages/PostDetail/PostDetailTimeInput";
import { PostDetailUrlInput } from "@renderer/pages/PostDetail/PostDetailUrlInput";
import { ArrowLeft } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Post } from "../../../../features/posts/entity";
import { CreatePostDialog } from "../MediaDetail/CreatePostDialog";

export const PostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const { channels } = useChannels();

  const fetchPost = useCallback(async () => {
    if (!postId) return;

    try {
      setIsLoading(true);
      const fetchedPost = await window.api["post:byId"](postId);
      setPost(fetchedPost);
    } catch (err) {
      setError("Failed to load post");
      console.error("Failed to load post:", err);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

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
          <Button className="mb-2" variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex justify-between">
            <h1 className="text-3xl font-semibold tracking-tight">Post</h1>
            <div className="flex items-center gap-2">
              <PostDetailDeleteButton post={post} onUpdate={fetchPost} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 py-6">
            <div className="flex flex-col gap-2">
              <div className="self-start">
                <ChannelBadge name={post.channel.name} typeId={post.channel.type.id} size="lg" />
              </div>
              <PostDetailMedia post={post} onUpdate={fetchPost} variant="detail" />
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
              <PostDetailStatusButton post={post} onUpdate={fetchPost} />
              <div className="border rounded-md p-2 grid w-auto grid-cols-[2fr_1fr] gap-2">
                <PostDetailDateInput post={post} onUpdate={fetchPost} />
                <PostDetailTimeInput post={post} onUpdate={fetchPost} />
              </div>
              <PostDetailUrlInput post={post} onUpdate={fetchPost} />
              <PostDetailCaptionInput post={post} onUpdate={fetchPost} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
