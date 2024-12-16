import { useEffect, useState } from "react";
import { Post } from "../../../../features/posts/entity";
import { PostDetail } from "./PostDetail";

interface MediaPostsProps {
  mediaId: string;
}

export function MediaPosts({ mediaId }: MediaPostsProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <div className="flex flex-col">
      {posts.map((post) => (
        <PostDetail post={post} onUpdate={fetchPosts} />
      ))}
    </div>
  );
}
