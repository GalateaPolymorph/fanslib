import { useEffect, useState } from "react";
import { Post } from "../../../../features/posts/entity";
import { PostDetail } from "./PostDetail/PostDetail";

type MediaPostsProps = {
  mediaId: string;
};

export const MediaPosts = ({ mediaId }: MediaPostsProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openPostIds, setOpenPostIds] = useState<Set<string>>(new Set());

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const posts = await window.api["post:byMediaId"](mediaId);
      setPosts(posts);
    } catch (err) {
      setError("Failed to load posts");
      console.error("Failed to load posts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [mediaId]);

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
    return <div className="text-destructive">{error}</div>;
  }

  if (posts.length === 0) {
    return <div className="text-muted-foreground">No posts found</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      {posts.map((post) => (
        <PostDetail
          key={post.id}
          post={post}
          onUpdate={fetchPosts}
          isOpen={openPostIds.has(post.id)}
          onOpenChange={(isOpen) => handleTogglePost(post.id, isOpen)}
        />
      ))}
    </div>
  );
};
