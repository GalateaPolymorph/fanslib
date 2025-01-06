import { useState } from "react";
import { type Post } from "../../../../features/posts/entity";
import { ScrollArea } from "../../components/ui/scroll-area";
import { cn } from "../../lib/utils";
import { isVirtualPost, VirtualPost } from "../../lib/virtual-posts";
import { PostDetail } from "../MediaDetail/PostDetail/PostDetail";

type PostTimelineProps = {
  posts: (Post | VirtualPost)[];
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
        {sortedPosts.map((post) => {
          const id = isVirtualPost(post) ? post.virtualId : post.id;

          return (
            <PostDetail
              key={id}
              post={post}
              onUpdate={onUpdate}
              isOpen={openPostId === id}
              onOpenChange={(isOpen) => setOpenPostId(isOpen ? id : null)}
            />
          );
        })}
      </div>
    </ScrollArea>
  );
};
