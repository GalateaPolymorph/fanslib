import { ChannelBadge } from "@renderer/components/ChannelBadge";
import { PostDetailCaptionInput } from "@renderer/components/PostDetail/PostDetailCaptionInput";
import { PostDetailDateInput } from "@renderer/components/PostDetail/PostDetailDateInput";
import { PostDetailDeleteButton } from "@renderer/components/PostDetail/PostDetailDeleteButton";
import { PostDetailMedia } from "@renderer/components/PostDetail/PostDetailMedia";
import { PostDetailStatusButton } from "@renderer/components/PostDetail/PostDetailStatusButton";
import { PostDetailTimeInput } from "@renderer/components/PostDetail/PostDetailTimeInput";
import { Button } from "@renderer/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Post } from "../../../../features/posts/entity";

export const PostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="overflow-y-auto">
      <div className="max-w-[1280px] px-8 mx-auto pt-8 pb-12">
        <Button className="mb-2" variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="flex justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">Post</h1>
          <div className="flex gap-2">
            <PostDetailDeleteButton post={post} onUpdate={fetchPost} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 py-6">
          <div className="flex flex-col gap-2">
            <div className="self-start">
              <ChannelBadge name={post.channel.name} typeId={post.channel.type.id} size="lg" />
            </div>
            <PostDetailMedia post={post} onUpdate={fetchPost} variant="detail" />
          </div>
          <div className="flex flex-col gap-2">
            <PostDetailStatusButton post={post} onUpdate={fetchPost} />
            <div className="border rounded-md p-2 grid w-auto grid-cols-[auto_1fr] gap-2">
              <PostDetailDateInput post={post} onUpdate={fetchPost} />
              <PostDetailTimeInput post={post} onUpdate={fetchPost} />
            </div>
            <PostDetailCaptionInput post={post} onUpdate={fetchPost} />
          </div>
        </div>
      </div>
    </div>
  );
};
