import { PostPreview } from "@renderer/components/PostPreview/PostPreview";
import { useState } from "react";
import { type Post } from "../../../../features/posts/entity";
import { ScrollArea } from "../../components/ui/scroll-area";
import { cn } from "../../lib/utils";
import { isVirtualPost, VirtualPost } from "../../lib/virtual-posts";

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
        {sortedPosts.map((post, index) => {
          const id = isVirtualPost(post) ? post.virtualId : post.id;
          const previousPost = index > 0 ? sortedPosts[index - 1] : null;

          return (
            <div key={id} className="space-y-4">
              <PostPreview
                post={post}
                onUpdate={onUpdate}
                isOpen={openPostId === id}
                onOpenChange={(isOpen) => setOpenPostId(isOpen ? id : null)}
                previousPostInList={previousPost}
              />
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};
