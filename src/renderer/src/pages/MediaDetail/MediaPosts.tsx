import { ChannelBadge } from "@renderer/components/ChannelBadge";
import { Button } from "@renderer/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@renderer/components/ui/table";
import { format } from "date-fns";
import { ArrowRight, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { Post } from "../../../../features/posts/entity";
import { StatusBadge } from "../../components/StatusBadge";

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

  const handleMarkAsPosted = async (postId: string) => {
    try {
      await window.api["post:update"](postId, { status: "posted" });
      await fetchPosts(); // Refresh the posts list
    } catch (err) {
      console.error("Failed to mark post as posted:", err);
    }
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
    <div className="border rounded-md">
      <Table>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id} className="hover:bg-background">
              <TableCell>
                <div className="flex w-fit">
                  <ChannelBadge name={post.channel.name} typeId={post.channel.typeId} />
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={post.status} />
              </TableCell>
              <TableCell>{format(new Date(post.date), "PPP")}</TableCell>
              <TableCell className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                  <a href={`/posts/${post.id}`}>
                    <ArrowRight className="size-4 -rotate-45" />
                  </a>
                </Button>
                {post.status === "draft" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleMarkAsPosted(post.id)}
                    className="text-green-500 hover:text-green-600 hover:bg-green-100"
                  >
                    <Check className="size-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
