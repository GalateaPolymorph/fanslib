import { usePostsByMediaId } from "@renderer/hooks";
import { useState } from "react";
import { PostPreview } from "../../components/PostPreview/PostPreview";

type MediaPostsProps = {
  mediaId: string;
};

export const MediaPosts = ({ mediaId }: MediaPostsProps) => {
  const { data: posts = [], isLoading, error, refetch } = usePostsByMediaId(mediaId);
  const [openPostIds, setOpenPostIds] = useState<Set<string>>(new Set());

  const handleUpdate = async () => {
    await refetch();
  };

  const handleTogglePost = (postId: string, isOpen: boolean) => {
    setOpenPostIds((prev) => {
      const next = new Set(prev);
      if (isOpen) {
        next.add(postId);
      } else {
        next.delete(postId);
      }
      return next;
    });
  };

  if (isLoading) {
    return <div className="text-muted-foreground">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-destructive">Failed to load posts</div>;
  }

  if (posts.length === 0) {
    return <div className="text-muted-foreground">No posts found</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      {posts.map((post) => (
        <PostPreview
          key={post.id}
          post={post}
          onUpdate={handleUpdate}
          isOpen={openPostIds.has(post.id)}
          onOpenChange={(isOpen) => handleTogglePost(post.id, isOpen)}
        />
      ))}
    </div>
  );
};
