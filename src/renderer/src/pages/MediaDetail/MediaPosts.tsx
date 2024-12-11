import { Badge } from "@renderer/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@renderer/components/ui/table";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Post } from "../../../../features/posts/entity";

interface MediaPostsProps {
  mediaId: string;
}

export function MediaPosts({ mediaId }: MediaPostsProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

  const getStatusColor = (status: Post["status"]) => {
    switch (status) {
      case "planned":
        return "warning";
      case "scheduled":
        return "warning";
      case "posted":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Channel</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>{post.channel.name}</TableCell>
              <TableCell>{format(new Date(post.date), "PPP")}</TableCell>
              <TableCell>
                <Badge variant={getStatusColor(post.status)}>{post.status}</Badge>
              </TableCell>
              <TableCell>
                <a href={`/posts/${post.id}`} className="text-accent-foreground hover:underline">
                  View
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
