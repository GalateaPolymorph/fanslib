import { useState } from "react";
import { type Post } from "../../../../features/posts/entity";
import { ScrollArea } from "../../components/ui/scroll-area";
import { cn } from "../../lib/utils";
import { PostDetail } from "../MediaDetail/PostDetail/PostDetail";

type PostTimelineProps = {
  posts: Post[];
  className?: string;
  onUpdate: () => Promise<void>;
};

export const PostTimeline = ({ posts, className, onUpdate }: PostTimelineProps) => {
  const [openPostId, setOpenPostId] = useState<string | null>(null);

  const sortedPosts = [...posts].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <ScrollArea className={cn("h-full pr-4", className)}>
      <div className="space-y-4">
        {sortedPosts.map((post) => (
          <PostDetail
            key={post.id}
            post={post}
            onUpdate={onUpdate}
            isOpen={openPostId === post.id}
            onOpenChange={(isOpen) => setOpenPostId(isOpen ? post.id : null)}
          />
        ))}
      </div>
    </ScrollArea>
  );
};
